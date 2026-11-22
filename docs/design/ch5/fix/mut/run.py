import json,subprocess,shutil,os,sys
M=os.path.dirname(os.path.abspath(__file__)); muts=json.load(open(M+'/muts.json',encoding='utf-8'))
w=int(sys.argv[1]); N=int(sys.argv[2]); W='/home/claude/uptime-fixmut-w%d'%w
if os.path.exists(W): shutil.rmtree(W)
shutil.copytree('/home/claude/uptime',W,ignore=shutil.ignore_patterns('.git','out','ch4','ch5'))
res=[]
for i,(name,f,a,b) in enumerate(muts):
    if i%N!=w: continue
    p=W+'/'+f; orig=open(p,encoding='utf-8').read()
    if orig.count(a)!=1: res.append([name,'ANCHOR MISSING']); continue
    open(p,'w',encoding='utf-8').write(orig.replace(a,b))
    subprocess.run(['python3','tools/build.py','charter'],cwd=W,capture_output=True)
    r=subprocess.run(['node','tests/charter.js'],cwd=W,capture_output=True,text=True,env=dict(os.environ,UPTIME_OUT=W+'/out'))
    t=r.stdout; i0=t.find('{')
    try: d=json.loads(t[i0:]); fails=[k for k,v in d['results'].items() if v!='ok']
    except Exception: fails=['CRASH '+(r.stderr or t)[-300:]]
    res.append([name,len(fails),[x[:100] for x in fails]])
    open(p,'w',encoding='utf-8').write(orig)
    json.dump(res,open(M+'/results-%d.json'%w,'w'),indent=1,ensure_ascii=False)
print('done',w)
