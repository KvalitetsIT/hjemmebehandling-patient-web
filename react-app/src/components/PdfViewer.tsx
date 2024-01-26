import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { ExternalLinkTarget } from 'react-pdf/dist/cjs/shared/types';
import { pdfjs } from 'react-pdf';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import { fileURLToPath } from 'url';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js',
    import.meta.url,
).toString();

console.log(import.meta.url)
console.log(pdfjs.GlobalWorkerOptions.workerSrc)


export function PdfViewer(props: { title?: string, file: string }) {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }


    function previous() {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1)
        }
    }

    function next() {
        if (pageNumber != numPages) {
            setPageNumber(pageNumber + 1)
        }
    }


    const getDimensions = () => {
        const viewer = document.getElementById("viewer");

        return {
            height: viewer?.clientHeight,
            width: viewer?.clientWidth
        }
    }


    let [dimensions, setDimensions] = useState<{ height: undefined | number, width: undefined | number }>(getDimensions())


    useEffect(() => {

        const handleResize = () => {
            console.log("Resize")
            setDimensions({height:800,width:550})
        }
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [])


    return (
        <>
            <Card>
                <CardHeader title={props.title} subheader={
                    <Typography>Side {pageNumber} af {numPages}</Typography>
                }
                    action={
                        <CardActions>
                            <Button onClick={previous} disabled={pageNumber == 1}>Tilbage</Button>
                            <Button onClick={next} disabled={pageNumber == numPages}>Næste</Button>
                        </CardActions>
                    }>
                </CardHeader>
                <CardContent>
                    <CardMedia id={"viewer"}>
                        <Document renderMode='canvas' file={props.file} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.error}>
                            <Page height={dimensions.height} width={dimensions.width} renderAnnotationLayer={false} renderTextLayer={false} pageNumber={pageNumber} />
                        </Document>
                    </CardMedia>


                </CardContent>
            </Card>
        </>
    );
}








