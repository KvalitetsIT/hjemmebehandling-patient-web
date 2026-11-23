import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';

// pdfjs 4 needs Promise.withResolvers, missing in e.g. Safari < 17.4. The legacy worker carries its own polyfills.
if (typeof (Promise as any).withResolvers !== 'function') {
    (Promise as any).withResolvers = function () {
        let resolve, reject;
        const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
        return { promise, resolve, reject };
    };
}

// Bundled with the app so the worker always matches the pdfjs-dist version react-pdf uses.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

// Defense in depth against CVE-2024-4367 style issues. Defined once so react-pdf does not reload the document on rerender.
const documentOptions = { isEvalSupported: false };


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
                        <Document renderMode='canvas' file={props.file} options={documentOptions} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.error}>
                            <Page height={dimensions.height} width={dimensions.width} renderAnnotationLayer={false} renderTextLayer={false} pageNumber={pageNumber} />
                        </Document>
                    </CardMedia>


                </CardContent>
            </Card>
        </>
    );
}








