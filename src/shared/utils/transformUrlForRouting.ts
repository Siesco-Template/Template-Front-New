export default function transformUrlForRouting(url: string) {
	const newUrl = url.split('/')
	return newUrl?.[newUrl.length - 1]
}