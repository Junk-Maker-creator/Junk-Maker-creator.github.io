/* Original pentatonic accompaniment. Nothing plays until a user gesture. */
(() => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const melody = [
    293.66, 349.23, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23,
    293.66, 349.23, 392.00, 440.00, 587.33, 523.25, 440.00, 392.00,
    349.23, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23, 293.66,
    329.63, 349.23, 392.00, 440.00, 392.00, 349.23, 293.66, null
  ];

  function createPlayer(forExport) {
    if (!AudioContextClass) throw new Error('当前浏览器不支持背景音乐。');
    const context = new AudioContextClass();
    const destination = forExport ? context.createMediaStreamDestination() : context.destination;
    const master = context.createGain();
    master.gain.value = 0.10;
    master.connect(destination);
    let timer = null, step = 0, nextTime = 0, active = false, closed = false;

    function pluck(frequency, time, duration, volume, type) {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, time);
      envelope.gain.setValueAtTime(0.0001, time);
      envelope.gain.exponentialRampToValueAtTime(volume, time + 0.025);
      envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      oscillator.connect(envelope);
      envelope.connect(master);
      oscillator.start(time);
      oscillator.stop(time + duration + 0.03);
      oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
    }

    function schedule() {
      if (!active || closed) return;
      // Schedule ahead so ordinary background throttling does not interrupt notes.
      while (nextTime < context.currentTime + 2) {
        const frequency = melody[step % melody.length];
        if (frequency) {
          pluck(frequency, nextTime, 0.64, 0.42, 'triangle');
          pluck(frequency * 2, nextTime, 0.26, 0.055, 'sine');
        }
        if (step % 8 === 0) pluck(step % 16 ? 174.61 : 146.83, nextTime, 1.4, 0.19, 'sine');
        nextTime += 0.48;
        step++;
      }
    }

    async function start() {
      if (closed) throw new Error('音乐已经停止。');
      if (active) return;
      await context.resume();
      if (closed) return;
      if (context.state !== 'running') throw new Error('浏览器未允许播放音乐。');
      active = true;
      if (!nextTime) nextTime = context.currentTime + 0.05;
      schedule();
      timer = setInterval(schedule, 400);
    }

    async function pause() {
      if (!active || closed) return;
      active = false;
      clearInterval(timer);
      await context.suspend();
    }

    function stop() {
      if (closed) return;
      closed = true;
      active = false;
      clearInterval(timer);
      if (forExport) destination.stream.getTracks().forEach(track => track.stop());
      master.disconnect();
      if (context.state !== 'closed') context.close().catch(() => {});
    }

    return {
      stream: forExport ? destination.stream : null,
      track: forExport ? destination.stream.getAudioTracks()[0] : null,
      start,
      pause,
      stop
    };
  }

  window.JourneyMusic = {
    supported: Boolean(AudioContextClass),
    createExportTrack: () => createPlayer(true)
  };

  const controls = document.querySelector('.controls');
  if (!controls) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'control secondary';
  button.textContent = '♪ 播放背景音乐';
  button.setAttribute('aria-pressed', 'false');
  button.title = '播放原创古风背景音乐';
  controls.appendChild(button);
  let player = null, busy = false, playing = false;
  button.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    try {
      if (playing) {
        await player.pause();
        playing = false;
        button.textContent = '♪ 继续背景音乐';
        button.setAttribute('aria-pressed', 'false');
      } else {
        if (!player) player = createPlayer(false);
        await player.start();
        playing = true;
        button.textContent = '♫ 暂停背景音乐';
        button.setAttribute('aria-pressed', 'true');
      }
    } catch (_) {
      if (player) player.stop();
      player = null;
      playing = false;
      button.textContent = '音乐不可用';
      button.title = '当前浏览器无法播放背景音乐，请尝试最新版 Chrome 或 Edge。';
    } finally {
      busy = false;
    }
  });
  window.addEventListener('pagehide', () => { if (player) player.stop(); });
})();
