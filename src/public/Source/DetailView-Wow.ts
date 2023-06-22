document.addEventListener('DOMContentLoaded', InitWowDetailSite);

async function InitWowDetailSite() {
    // @ts-ignore
    shaka.polyfill.installAll();

    // @ts-ignore
    if (shaka.Player.isBrowserSupported()) {
        await InitABStreaming(location, document.getElementById('wow-detail-View-Video') as HTMLVideoElement, "/public/Assets/Videos/WowDetailView/manifest.mpd");
    } else {
        console.error('Browser does not support shaka player!');
        alert("The site might not work as intended because you browser doesn't support the shaka browser.")
    }

    InitPlayBackSpeedInput();
}

function InitPlayBackSpeedInput() {
    const videoElement = document.getElementById('wow-detail-View-Video') as HTMLVideoElement;
    const currentSpeed = document.getElementById('currentSpeed') as HTMLSpanElement;
    const speedRange = document.getElementById('speedRange') as HTMLInputElement

    speedRange.addEventListener('input', () => {
        const speed = parseFloat(speedRange.value);
        videoElement.playbackRate = speed;
        currentSpeed.textContent = `${speed}x`
    });
}

// @ts-ignore
async function InitABStreaming(location: Location, videoElement: HTMLVideoElement, pathToManifestFile: string) {
    let currentURL = new URL(location.href);
    let existingPath = currentURL.pathname.substring(0, currentURL.pathname.lastIndexOf('/'));
    currentURL.pathname = `${existingPath}${pathToManifestFile}`
    currentURL.search = "";

    let player: any;
    // @ts-ignore
    window.player = player = new shaka.Player(videoElement);
    player.addEventListener('error', onErrorEvent);

    try
    {
        await player.load(currentURL.toString());
        enableAudioSelection(player);
    }
    catch (e) {
        onError(e);
    }

    function onErrorEvent(event: any) {
        onError(event.detail);
    }

    function onError(error: any) {
        console.error('Error code', error.code, 'object', error);
    }
}

function enableAudioSelection(player: any) {
    let grouping: Map<number, any[]> = player.getVariantTracks().reduce((mapping: Map<number, any[]>, track: any) => {
        let currentArr = mapping.get(track.audioId);
        if (currentArr === undefined)
        {
            currentArr = [track];
            mapping.set(track.audioId, currentArr);
        }
        else
        {
            currentArr.push(track);
        }
        return mapping;
    }, new Map<number, any[]>());

    const audioSelect = document.createElement('select');
    audioSelect.addEventListener('change', () => {
        let tracks = grouping.get(parseInt(audioSelect.value)) as any[];
        console.log(tracks);
        console.log(player.getStats());
        let newTrack = tracks.find(value => value.bandwidth === player.getStats().streamBandwidth);
        console.log(newTrack);
        player.selectVariantTrack(newTrack, true);
    });

    player.addEventListener('adaptation', (oldTrack: any, newTrack: any) => {
        let tracks = grouping.get(parseInt(audioSelect.value)) as any[];
        let track = tracks.find(t => t.videoBandwidth == newTrack.videoBandwidth);
        console.log(track);
        player.selectVariantTrack(track, true);
    });

    grouping.forEach((_, key) => {
        const option = document.createElement('option');
        option.text = key.toString();
        audioSelect.add(option);
    });

    const audioContainer = document.getElementById('wow-detail-view-video-controls') as HTMLDivElement;
    audioContainer.appendChild(audioSelect);
}