document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('wow-detail-View-Video') as HTMLVideoElement;
    const currentSpeed = document.getElementById('currentSpeed') as HTMLSpanElement;
    const speedRange = document.getElementById('speedRange') as HTMLInputElement

    speedRange.addEventListener('input', () => {
        const speed = parseFloat(speedRange.value);
        videoElement.playbackRate = speed;
        currentSpeed.textContent = `${speed}x`
    });
});