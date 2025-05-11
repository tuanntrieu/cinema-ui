import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export function getYoutubeVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export function createSafeTrailerUrl(videoUrl: string, sanitizer: DomSanitizer): SafeResourceUrl | null {
    const videoId = getYoutubeVideoId(videoUrl);
    if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&autoplay=1`;
        return sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
    return null;
}
