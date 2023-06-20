document.addEventListener('DOMContentLoaded', InitIndexSite);

async function InitIndexSite() {
    CreateIntersectionObserver();
    // @ts-ignore
    shaka.polyfill.installAll();

    // @ts-ignore
    if (shaka.Player.isBrowserSupported()) {
        await InitABStreaming(location, document.getElementById('wow-home-page-video') as HTMLVideoElement, "/public/Assets/Videos/Home/manifest.mpd");
    } else {
        console.error('Browser does not support shaka player!');
        alert("The site might not work as intended because you browser doesn't support the shaka browser.")
    }
}

function CreateIntersectionObserver() {
    const fadeInTotkImageClass = "totk-fade-in-Image";
    const fadeInWowImageClass = "wow-fade-in-Image";
    const totkSection = document.getElementById('Zelda-Tears-of-the-Kingdom') as HTMLSelectElement;
    const wowSection = document.getElementById('Word-of-Warcraft') as HTMLSelectElement;

    const totkStartIntersectionObserver = CreateStartingIntersectionObserver(fadeInTotkImageClass);
    const totkEndIntersectionObserver = CreateEndingIntersectionObserver(fadeInTotkImageClass);
    const wowStartIntersectionObserver = CreateStartingIntersectionObserver(fadeInWowImageClass);
    const wowEndIntersectionObserver = CreateEndingIntersectionObserver(fadeInWowImageClass);

    totkStartIntersectionObserver.observe(totkSection);
    totkEndIntersectionObserver.observe(totkSection);
    wowStartIntersectionObserver.observe(wowSection);
    wowEndIntersectionObserver.observe(wowSection);

    function CreateEndingIntersectionObserver(classNameToRemove: string): IntersectionObserver {
        return new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting)
                {
                    entry.target.classList.remove(classNameToRemove)
                }
            })
        }, { threshold: 0.9 })
    }

    function CreateStartingIntersectionObserver(classNameToAdd: string): IntersectionObserver {
        return new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting)
                {
                    entry.target.classList.add(classNameToAdd)
                }
            })
        }, { threshold: 0.7 })
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
        console.error('Error code', error.code, 'object', error, 'error data', error.data);
    }
}