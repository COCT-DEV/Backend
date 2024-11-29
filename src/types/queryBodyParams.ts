

type hymnQueryParams ="ENGLISH" | "TWI"

export type hymnReqQuery = {
    version: hymnQueryParams | undefined
}

export type hymnReqBody = {
    hymnId: string
}