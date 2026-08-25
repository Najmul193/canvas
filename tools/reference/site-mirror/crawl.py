import os,re,time,urllib.request,urllib.error,hashlib
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
urls=[u.strip() for u in open("urls.txt") if u.strip()]
urls=["https://www.canvas-bd.com/"]+urls
seen=set(); ok=0; fail=[]
for u in urls:
    if u in seen: continue
    seen.add(u)
    slug=u.replace("https://www.canvas-bd.com/","").strip("/") or "home"
    fn="pages/"+re.sub(r'[^A-Za-z0-9._-]','_',slug)+".html"
    if os.path.exists(fn): ok+=1; continue
    try:
        r=urllib.request.Request(u,headers={"User-Agent":UA})
        d=urllib.request.urlopen(r,timeout=30).read()
        open(fn,"wb").write(d); ok+=1
    except Exception as e:
        fail.append((u,str(e)[:60]))
    time.sleep(0.35)
print("fetched",ok,"failed",len(fail))
for f in fail[:15]: print("  FAIL",f)
