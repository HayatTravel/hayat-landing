import D from '../data/catalog'

/* The one server-side catalogue: route loaders read products through it, never from src/data directly.
   Today every product returns the mock catalogue. A slice switches one product to booking's customer API
   (`{jisr}/api/v1/customer/*`, JW-2+) by changing that product's functions here; the pages stay as they are.
   `.server` keeps this module (and later the API token) out of the browser bundle. */
export const catalog = {
  esim: { countries: async () => D.esim },
  hotels: { list: async () => D.hotels },
}
