import { FC } from 'react'
import { LazyLoadImage, LazyLoadImageProps } from 'react-lazy-load-image-component';
const S_Image: FC<LazyLoadImageProps> = (props) => {
	return <LazyLoadImage {...props}/>
}

export default S_Image