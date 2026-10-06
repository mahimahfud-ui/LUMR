import express from 'express';
import {fileURLToPath} from 'url';
import {dirname,join} from 'path';
const __filename=fileURLToPath(import.meta.url),__dirname=dirname(__filename),app=express(),PORT=process.env.PORT||3000;
app.disable('x-powered-by');
const publicDir=join(__dirname,'public');
app.use((req,res,next)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Frame-Options','SAMEORIGIN');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline' https://esm.sh https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:; connect-src 'self' https: wss:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'");
  if(req.headers['x-forwarded-proto']==='https')res.setHeader('Strict-Transport-Security','max-age=31536000; includeSubDomains');
  next();
});
app.use(express.static(publicDir,{etag:true,maxAge:'1h'}));
app.get('/api/config',(req,res)=>{res.setHeader('Cache-Control','no-store');res.json({supabaseUrl:process.env.SUPABASE_URL||'',publishableKey:process.env.SUPABASE_PUBLISHABLE_KEY||process.env.SUPABASE_ANON_KEY||'',youtubeUrl:process.env.YOUTUBE_URL||''})});
app.get('*',(req,res)=>res.sendFile(join(publicDir,'index.html')));
app.listen(PORT,'0.0.0.0',()=>console.log('mahimahfud running on '+PORT));