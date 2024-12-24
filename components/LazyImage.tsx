import React, {JSX, useEffect, useRef, useState} from "react";


type LazyImageProps = {
    src: string;
    onLazyLoad?: (image: HTMLImageElement) => void
}

type ImageNativeTypes = React.ImgHTMLAttributes<HTMLImageElement>

type Props = LazyImageProps & ImageNativeTypes

export const LazyImage = ({src, onLazyLoad, ...imgProps}: Props): JSX.Element => {

    const imgRef = useRef<HTMLImageElement>(null)

    const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined)

    const [isImageLoading, setIsImageLoading] = useState(true)

    useEffect(() => {
        const FoxImageObserverCallback: IntersectionObserverCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setCurrentSrc(src)
                    observer.unobserve(entry.target)
                }
            })
        }

        const FoxImageObserver: IntersectionObserver = new IntersectionObserver(FoxImageObserverCallback)

        if (imgRef.current) {
            FoxImageObserver.observe(imgRef.current)
        }

        return () => {
            FoxImageObserver.disconnect()
        }
    }, [src]);


    return <img
        ref={imgRef}
        width={320}
        height="auto"
        className={`aspect-square object-cover rounded-lg bg-gray-300 min-h-1 transition-all duration-300 ease-in-out ${isImageLoading ? "blur-md" : ""}`}
        src={currentSrc}
        onLoad={() => {
            setIsImageLoading(false)
            if (imgRef.current && onLazyLoad) {
                onLazyLoad(imgRef.current)
            }
        }}
        {...imgProps}
    />
}
