const isItProd=true
const prod = "https://pass2park.it/api/"
const dev = "https://app.dev.pass2park.it/api/"
export const ConfigUrls = {
    baseUrl:isItProd? prod:dev 
}