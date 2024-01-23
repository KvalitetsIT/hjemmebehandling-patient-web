import { PdfViewer } from "../components/PdfViewer"

export const Guide = () => {
    return (
        <PdfViewer title = "Guide" file={"./guide"}></PdfViewer>
    )
}
export const KvikGuide = () => {
    return (
        <PdfViewer title="Kvikguide"file={"./kvikguide"}></PdfViewer>
    )
}