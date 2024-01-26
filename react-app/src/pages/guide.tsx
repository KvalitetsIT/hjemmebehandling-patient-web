import { PdfViewer } from "../components/PdfViewer"

export const Guide = () => {
    return (
        <PdfViewer title = "Guide" file={"./guide.pdf"}></PdfViewer>
    )
}
export const KvikGuide = () => {
    return (
        <PdfViewer title="Kvikguide"file={"./kvikguide.pdf"}></PdfViewer>
    )
}