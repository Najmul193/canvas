import os,re,time,urllib.request,urllib.parse
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
rows=[l.rstrip("\n").split("\t") for l in open("download_list.txt") if l.strip()]
ok=skip=fail=0; fails=[]
for model,i,path in rows:
    name=urllib.parse.unquote(path.split("/")[-1])
    name=re.sub(r'[^A-Za-z0-9._%() -]','_',name)
    out=f"assets/{model}/{i}__{name}"
    if os.path.exists(out) and os.path.getsize(out)>0: skip+=1; continue
    url="https://www.canvas-bd.com"+urllib.parse.quote(path,safe="/%")
    try:
        r=urllib.request.Request(url,headers={"User-Agent":UA})
        d=urllib.request.urlopen(r,timeout=40).read()
        if len(d)<100: raise ValueError("tiny")
        open(out,"wb").write(d); ok+=1
    except Exception as e:
        fail+=1; fails.append((url[:100],str(e)[:50]))
    time.sleep(0.15)
print(f"ok={ok} skip={skip} fail={fail}")
for f in fails[:20]: print(" FAIL",f)
