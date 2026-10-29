import { PassThrough } from 'node:stream'
import { createReadableStreamFromReadable } from '@react-router/node'
import { ServerRouter } from 'react-router'
import { renderToPipeableStream } from 'react-dom/server'

export const streamTimeout = 5_000

/* The default Node entry, except every visitor gets the whole page in the HTML (onAllReady), not only bots. */
export default function handleRequest(request, status, headers, routerContext) {
  if (request.method.toUpperCase() === 'HEAD') return new Response(null, { status, headers })
  return new Promise((resolve, reject) => {
    let ready = false
    const timer = setTimeout(() => abort(), streamTimeout + 1000)
    const { pipe, abort } = renderToPipeableStream(<ServerRouter context={routerContext} url={request.url} />, {
      onAllReady() {
        ready = true
        const body = new PassThrough({ final(cb) { clearTimeout(timer); cb() } })
        headers.set('Content-Type', 'text/html')
        pipe(body)
        resolve(new Response(createReadableStreamFromReadable(body), { headers, status }))
      },
      onShellError: reject,
      onError(error) { status = 500; if (ready) console.error(error) },
    })
  })
}
