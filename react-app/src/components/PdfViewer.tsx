import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { ExternalLinkTarget } from 'react-pdf/dist/cjs/shared/types';
import { pdfjs } from 'react-pdf';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

export function PdfViewer(props: { title?: String, file: String }) {
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
            setDimensions(getDimensions())
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
                        <Document renderMode='canvas' file={"/kvikguide.pdf"} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page height={dimensions.height} width={dimensions.width} renderAnnotationLayer={false} renderTextLayer={false} pageNumber={pageNumber} />
                        </Document>
                    </CardMedia>


                </CardContent>
            </Card>
        </>
    );
}








