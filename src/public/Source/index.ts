const fadeInTotkImageClass = "totk-fade-in-Image";
const fadeInWowImageClass = "wow-fade-in-Image";

const totkSection = document.getElementById("Zelda Tears of the Kingdom")!;
const wowSection = document.getElementById("Word of Warcraft")!;

const totkStartIntersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting)
        {
            entry.target.classList.add(fadeInTotkImageClass);
        }
    });
}, { threshold: 0.7 });

const totkEndIntersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting)
        {
            entry.target.classList.remove(fadeInTotkImageClass);
        }
    })
}, { threshold: 0.9 });

const wowStartIntersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting)
        {
            entry.target.classList.add(fadeInWowImageClass);
        }
    });
}, { threshold: 0.7 });

const wowEndIntersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting)
        {
            entry.target.classList.remove(fadeInWowImageClass);
        }
    })
}, { threshold: 0.9 });

totkStartIntersectionObserver.observe(totkSection);
totkEndIntersectionObserver.observe(totkSection);
wowStartIntersectionObserver.observe(wowSection);
wowEndIntersectionObserver.observe(wowSection);