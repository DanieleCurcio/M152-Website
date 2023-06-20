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