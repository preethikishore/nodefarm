
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replacetemplate = require('./modules/replaceTemp'); 
const data =  fs.readFileSync(`${__dirname}/dev_data/farmData.json`,'utf-8');
const dataObj = JSON.parse(data);
dataObj.map(el => { 
       el['slug'] = slugify(el.productName, { lower: true }); 
     });
const temp_overview = fs.readFileSync(`${__dirname}/template/template_overview.html`,'utf-8');
const temp_card = fs.readFileSync(`${__dirname}/template/template_card.html`,'utf-8');
const product_card = fs.readFileSync(`${__dirname}/template/product.html`,'utf-8');
const server = http.createServer(
       (req,res)=>{
         const {query,pathname} = url.parse(req.url,true);
         if(pathname === '/overview' || pathname === '/')
         {
             const cardhtml = dataObj.map(el=>replacetemplate(temp_card,el)).join('') ;
             const output = temp_overview.replace(`{%PRODUCT_CARD%}`,cardhtml);  
             res.writeHead(200 ,{ 'Content-Type' :'text/html'});
             res.end(output);
         }else if(pathname.includes('/product'))
         {
              
              const slug = pathname.replace('/product/', '');
               const product = dataObj.filter(element =>  element.slug === slug)[0];
              const output = replacetemplate(product_card, product);
              res.end(output);
       
               
         }else if(pathname === '/Api')
         {
              res.writeHead(200 ,{ 'Content-Type' :'application/json'});              
              res.end(data);     
         }
         else
         {
                res.writeHead(404 ,{
              
                     'Content-Type' :'text/html',
                     'my-own-header' : 'hello-world'

                })
                res.end('Page Cannot be found !!!!');
         }
       });

server.listen(8000,()=>
{
       console.log('Server is Listneing !!!');
})