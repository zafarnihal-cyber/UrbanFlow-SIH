const STATIC_MODE=location.hostname.endsWith("github.io") || location.protocol==="file:";
const STATIC_DEMO={
 kpis:{congestion:54.4,vehicles:6,deliveries:4980,resource:70.2},
 traffic:[
  {id:1,zone:"Logistics Hub B",lat:12.962,lng:77.610,congestion:74,avg_speed:18},
  {id:2,zone:"Airport Corridor",lat:13.001,lng:77.620,congestion:67,avg_speed:20},
  {id:3,zone:"North Zone",lat:12.985,lng:77.603,congestion:58,avg_speed:22},
  {id:4,zone:"Market Road",lat:12.958,lng:77.586,congestion:42,avg_speed:29},
  {id:5,zone:"Central Hub",lat:12.9716,lng:77.5946,congestion:31,avg_speed:34}
 ],
 vehicles:[
  {id:1,code:"TRK-087",type:"Truck",lat:12.965,lng:77.5845,speed:21,load:91,status:"On Route"},
  {id:2,code:"TRK-104",type:"Truck",lat:12.9716,lng:77.5946,speed:34,load:82,status:"On Route"},
  {id:3,code:"BUS-044",type:"Bus",lat:12.955,lng:77.610,speed:18,load:70,status:"On Route"},
  {id:4,code:"VAN-221",type:"Van",lat:12.9785,lng:77.603,speed:27,load:64,status:"Optimized"},
  {id:5,code:"EV-512",type:"EV Van",lat:12.982,lng:77.575,speed:31,load:55,status:"On Route"},
  {id:6,code:"VAN-316",type:"Van",lat:12.989,lng:77.615,speed:39,load:47,status:"On Route"}
 ],
 deliveries:[
  {id:1,vehicle:"TRK-104",origin:"Hub A",destination:"Hub C",load:82,eta:12,status:"On Route"},
  {id:2,vehicle:"VAN-221",origin:"Hub B",destination:"Market",load:64,eta:18,status:"Optimized"},
  {id:3,vehicle:"TRK-087",origin:"Depot",destination:"Hub B",load:91,eta:24,status:"On Route"},
  {id:4,vehicle:"VAN-316",origin:"Market",destination:"Hub C",load:47,eta:31,status:"On Route"},
  {id:5,vehicle:"EV-512",origin:"Hub C",destination:"Airport",load:55,eta:19,status:"On Route"}
 ],
 resources:[
  {id:1,name:"Hub A",capacity:100,used:81},{id:2,name:"Hub B",capacity:100,used:76},{id:3,name:"Hub C",capacity:100,used:72},{id:4,name:"Loading Bays",capacity:100,used:68},{id:5,name:"Parking",capacity:100,used:54}
 ],
 alerts:[
  {id:1,level:"warning",title:"High congestion detected",message:"Logistics Hub B is at 74% congestion."},
  {id:2,level:"warning",title:"Delivery bottleneck",message:"27 vehicles are waiting near Hub B."},
  {id:3,level:"success",title:"Resource opportunity",message:"Hub C has 28% spare capacity."}
 ]
};
function clone(x){return JSON.parse(JSON.stringify(x))}
let staticData=clone(STATIC_DEMO);
function staticApi(path,options={}){
 const method=(options.method||"GET").toUpperCase();
 if(path==="/api/dashboard") return Promise.resolve(clone(staticData));
 if(path==="/api/prediction") return Promise.resolve({
  priority_zone:"Logistics Hub B",priority_prediction:89.3,vehicles_to_prepare:13,estimated_delay_avoided_min:5,
  recommended_action:"Prepare vehicles near Hub C and divert Hub B-bound traffic",model:"Demo forecasting model using congestion + speed signals",
  zones:[
   {zone:"Logistics Hub B",current:74,in_15_min:89,in_30_min:94,avg_speed:18,risk:"HIGH"},
   {zone:"Airport Corridor",current:67,in_15_min:81,in_30_min:84,avg_speed:20,risk:"HIGH"},
   {zone:"North Zone",current:58,in_15_min:70,in_30_min:73,avg_speed:22,risk:"MEDIUM"},
   {zone:"Market Road",current:42,in_15_min:49,in_30_min:51,avg_speed:29,risk:"LOW"},
   {zone:"Central Hub",current:31,in_15_min:34,in_30_min:36,avg_speed:34,risk:"LOW"}
  ]});
 if(path==="/api/fleet-plan") return Promise.resolve({bottleneck:"Logistics Hub B",spare_resource:"Parking",summary:"4 fleet actions recommended around Logistics Hub B.",plan:[
  {vehicle:"TRK-087",type:"Truck",load:91,action:"Hold at lower-congestion hub",target:"Hub C",reason:"High vehicle load + current bottleneck pressure"},
  {vehicle:"TRK-104",type:"Truck",load:82,action:"Continue current route",target:"Assigned route",reason:"Current route remains acceptable"},
  {vehicle:"VAN-221",type:"Van",load:64,action:"Use alternate corridor",target:"North Corridor",reason:"Lower predicted congestion"},
  {vehicle:"VAN-316",type:"Van",load:47,action:"Continue current route",target:"Assigned route",reason:"Current route remains acceptable"},
  {vehicle:"EV-512",type:"EV Van",load:55,action:"Use alternate corridor",target:"North Corridor",reason:"Lower predicted congestion"},
  {vehicle:"BUS-044",type:"Bus",load:70,action:"Use alternate corridor",target:"North Corridor",reason:"Lower predicted congestion"}
 ]});
 if(path==="/api/resource-forecast") return Promise.resolve({resources:[
  {name:"Hub A",current:81,forecast:90.7,spare_now:19,risk:"HIGH",action:"Shift incoming deliveries to Hub C"},
  {name:"Hub B",current:76,forecast:85.1,spare_now:24,risk:"HIGH",action:"Shift incoming deliveries to Hub C"},
  {name:"Hub C",current:72,forecast:80.6,spare_now:28,risk:"MEDIUM",action:"Reserve capacity"},
  {name:"Loading Bays",current:68,forecast:76.2,spare_now:32,risk:"MEDIUM",action:"Reserve capacity"},
  {name:"Parking",current:54,forecast:60.5,spare_now:46,risk:"LOW",action:"No action required"}
 ]});
 if(path==="/api/impact") return Promise.resolve({before:{congestion:54.4,resource:70.2,eta:32},after:{congestion:36.4,resource:53.2,eta:24},improvement:{congestion:18,resource:17,eta:8}});
 if(path==="/api/decision-explain") return Promise.resolve({
  route:["Logistics Hub B is the highest-congestion zone at 74%.","North Corridor has lower predicted congestion than the direct route.","The recommended route saves about 8 minutes (32 → 24 min)."],
  fleet:["TRK-087 has 91% load, so it is held at a lower-congestion hub.","Vehicles with flexible routes are shifted toward the North Corridor.","Vehicles on acceptable routes continue without unnecessary changes."],
  resources:["Hub C has 28% spare capacity.","Forecast pressure is highest around Hub A/Hub B.","Incoming work can be shifted before capacity becomes constrained."],
  transparency:"Recommendations are based on congestion, speed, ETA, vehicle load and available capacity. This GitHub Pages demo uses simulated inputs."
 });
 if(path==="/api/routes") return Promise.resolve({routes:[
  {name:"Route A · Direct",congestion:72.4,eta:32,status:"Congested"},
  {name:"Route B · North Corridor",congestion:37.4,eta:24,status:"Recommended"},
  {name:"Route C · East Bypass",congestion:46.4,eta:27,status:"Alternative"}
 ]});
 if(path==="/api/optimize") return Promise.resolve({origin:"Hub A",destination:"Hub C",current_eta:32,optimized_eta:24,time_saved_min:8,congestion_reduction:18,vehicles_reassigned:9,recommended_route:"North Corridor → Central Hub → Destination",reason:"Weighted score favors lower congestion and higher average speed; current bottleneck is Logistics Hub B."});
 if(path==="/api/simulate") { staticData.traffic.forEach(t=>{t.congestion=Math.min(95,Math.max(20,+(t.congestion+(Math.random()*6-3)).toFixed(1)));}); staticData.kpis.congestion=+(staticData.traffic.reduce((a,t)=>a+t.congestion,0)/staticData.traffic.length).toFixed(1); return Promise.resolve({ok:true}); }
 if(path.startsWith("/api/alerts/") && path.endsWith("/resolve")){const id=Number(path.split("/")[3]);staticData.alerts=staticData.alerts.filter(a=>a.id!==id);return Promise.resolve({ok:true});}
 return Promise.reject(new Error("Static demo endpoint not available: "+path));
}

const API=location.origin;let token=localStorage.getItem("uf_token"),data=null,map,routeLayer,vehicleLayer,trafficLayer;
const $=id=>document.getElementById(id);
$("loginForm").onsubmit=async e=>{e.preventDefault();try{if(STATIC_MODE){if($("email").value!=="admin@urbanflow.local"||$("password").value!=="admin123")throw Error("Use the demo account shown below.");token="github-demo";localStorage.setItem("uf_token",token);show();return;}let r=await fetch(API+"/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:$("email").value,password:$("password").value})});let j=await r.json();if(!r.ok)throw Error(j.detail);token=j.token;localStorage.setItem("uf_token",token);show()}catch(e){$("loginError").textContent=e.message}};
function headers(){return{Authorization:"Bearer "+token,"Content-Type":"application/json"}}
async function api(p,o={}){if(STATIC_MODE)return staticApi(p,o);o.headers={...(o.headers||{}),...headers()};let r=await fetch(API+p,o);if(r.status===401){logout();throw Error("Session expired")}let j=await r.json();if(!r.ok)throw Error(j.detail||"Request failed");return j}
function show(){$("login").classList.add("hidden");$("app").classList.remove("hidden");load();setTimeout(initMap,100);connect()}
function logout(){localStorage.removeItem("uf_token");location.reload()}
if(token)show();

document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>{document.querySelectorAll("nav a").forEach(x=>x.classList.remove("active"));a.classList.add("active");document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));let id=a.dataset.view==="alerts"?"alertsView":a.dataset.view;$(id).classList.remove("hidden");let t={dashboard:["City Intelligence Center","One platform for transport, logistics and infrastructure decisions."],traffic:["Traffic Intelligence","Congestion, speed and hotspot monitoring"],logistics:["Smart Logistics","Fleet allocation and delivery flow"],resources:["City Resources","Capacity and utilization across the network"],analytics:["AI Analytics","Performance and decision intelligence"],alerts:["Active Alerts","Events requiring attention"]};$("title").textContent=t[a.dataset.view][0];$("subtitle").textContent=t[a.dataset.view][1];if(a.dataset.view==="dashboard"&&map)setTimeout(()=>map.invalidateSize(),100);render()});

async function load(){try{data=await api("/api/dashboard");render();loadPrediction();loadFleet();loadResourcesForecast()}catch(e){}}
function render(){if(!data)return;$("kc").textContent=data.kpis.congestion+"%";$("kv").textContent=data.kpis.vehicles;$("kd").textContent=data.kpis.deliveries.toLocaleString();$("kr").textContent=data.kpis.resource+"%";$("alertCount").textContent=data.alerts.length;renderMapData();renderAlerts();renderTraffic();renderDeliveries();renderResources();drawChart()}
function initMap(){if(map||!window.L)return;map=L.map("map").setView([12.9716,77.5946],12);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(map);renderMapData()}
function renderMapData(){if(!map||!data)return;if(vehicleLayer)vehicleLayer.clearLayers();if(trafficLayer)trafficLayer.clearLayers();if(routeLayer)routeLayer.clearLayers();vehicleLayer=L.layerGroup().addTo(map);trafficLayer=L.layerGroup().addTo(map);
data.traffic.forEach(t=>{let color=t.congestion>65?"#dc2626":t.congestion>40?"#f59e0b":"#16a34a";L.circle([t.lat,t.lng],{radius:450+8*t.congestion,color,fillColor:color,fillOpacity:.22,weight:2}).bindPopup(`<b>${t.zone}</b><br>Congestion: ${Math.round(t.congestion)}%<br>Avg speed: ${t.avg_speed} km/h`).addTo(trafficLayer);L.marker([t.lat,t.lng]).bindTooltip(t.zone+" · "+Math.round(t.congestion)+"%",{direction:"top"}).addTo(trafficLayer)});
data.vehicles.forEach(v=>{let icon=L.divIcon({className:"vehicle",html:`<div style="background:${v.status==="Optimized"?"#2563eb":"#111827"};color:white;border:2px solid white;border-radius:50%;width:22px;height:22px;display:grid;place-items:center;font-size:10px;box-shadow:0 2px 8px #0005">●</div>`});L.marker([v.lat,v.lng],{icon}).bindPopup(`<b>${v.code}</b><br>${v.type}<br>Speed: ${v.speed} km/h<br>Load: ${v.load}%<br>${v.status}`).addTo(vehicleLayer)})}
function renderAlerts(){$("alerts").innerHTML=data.alerts.slice(0,5).map(a=>`<div class="alert ${a.level==="success"?"success":""}"><b>${a.title}</b><p>${a.message}</p></div>`).join("");$("allAlerts").innerHTML=data.alerts.map(a=>`<div class="alert ${a.level==="success"?"success":""}"><b>${a.title}</b><p>${a.message}</p><button class="light" style="margin-top:7px;padding:6px 9px" onclick="resolve(${a.id})">Resolve</button></div>`).join("")}
function renderTraffic(){$("bars").innerHTML=data.traffic.map(t=>`<div class="barrow"><div><span>${t.zone}</span><b>${Math.round(t.congestion)}%</b></div><div class="bar"><div class="fill" style="width:${t.congestion}%"></div></div></div>`).join("");$("trafficTable").innerHTML="<tr><th>Zone</th><th>Congestion</th><th>Speed</th><th>Status</th></tr>"+data.traffic.map(t=>`<tr><td>${t.zone}</td><td>${Math.round(t.congestion)}%</td><td>${t.avg_speed} km/h</td><td><span class=badge>${t.congestion>65?"Congested":t.congestion>40?"Busy":"Normal"}</span></td></tr>`).join("")}
function renderDeliveries(){$("deliveryTable").innerHTML="<tr><th>Vehicle</th><th>Route</th><th>Load</th><th>ETA</th><th>Status</th></tr>"+data.deliveries.map(d=>`<tr><td>${d.vehicle}</td><td>${d.origin} → ${d.destination}</td><td>${d.load}%</td><td>${d.eta} min</td><td><span class=badge>${d.status}</span></td></tr>`).join("")}
function renderResources(){$("resourcesGrid").innerHTML=data.resources.map(r=>`<div class=resource><h3>${r.name}</h3><strong>${Math.round(r.used)}%</strong><p>utilized</p><div class=bar><div class=fill style="width:${r.used}%"></div></div><p style="color:#027a48">${Math.round(r.capacity-r.used)}% spare capacity</p></div>`).join("")}
async function optimize(){let r=await api("/api/optimize",{method:"POST",body:JSON.stringify({origin:"Hub A",destination:"Hub C"})});let rr=await api("/api/routes");$("optResult").classList.remove("hidden");$("optResult").innerHTML=`<b>🤖 AI route optimized</b><br><b>${r.recommended_route}</b><br>Current ETA <b>${r.current_eta} min</b> → Optimized ETA <b>${r.optimized_eta} min</b> · <b>${r.time_saved_min} min saved</b> · <b>${r.congestion_reduction}%</b> projected congestion reduction.<br><small>${r.reason}</small><div class="route-table"><table><tr><th>Route</th><th>Congestion</th><th>ETA</th><th>Status</th></tr>${rr.routes.map(x=>`<tr class="${x.status==="Recommended"?"route-recommended":x.status==="Congested"?"route-congested":""}"><td>${x.name}</td><td>${x.congestion}%</td><td>${x.eta} min</td><td><b>${x.status}</b></td></tr>`).join("")}</table></div>`;drawRoute();load()}
function drawRoute(){if(!map)return;if(routeLayer)routeLayer.clearLayers();routeLayer=L.layerGroup().addTo(map);let current=[[12.965,77.5845],[12.9716,77.5946],[12.962,77.610]];let alt=[[12.965,77.5845],[12.9785,77.603],[12.985,77.603],[12.9716,77.5946],[12.962,77.610]];L.polyline(current,{color:"#dc2626",weight:6,opacity:.65,dashArray:"8 8"}).bindPopup("Current route · congestion").addTo(routeLayer);L.polyline(alt,{color:"#16a34a",weight:7,opacity:.9}).bindPopup("AI recommended route").addTo(routeLayer);map.fitBounds(L.latLngBounds(alt),{padding:[25,25]})}
async function simulate(){await api("/api/simulate",{method:"POST"});await load()}
async function resolve(id){await api("/api/alerts/"+id+"/resolve",{method:"POST"});await load()}
function connect(){if(STATIC_MODE)return;try{let w=new WebSocket((location.protocol==="https:"?"wss://":"ws://")+location.host+"/ws");w.onclose=()=>setTimeout(connect,3000);w.onmessage=()=>load()}catch(e){}}
async function loadPrediction(){
  try{
    let p=await api("/api/prediction");
    let w=p.zones.reduce((a,b)=>a.in_15_min>b.in_15_min?a:b);
    $("predictionSummary").innerHTML=`<b>Priority zone: ${p.priority_zone}</b> · Predicted congestion in 15 min: <b>${p.priority_prediction}%</b> · Prepare <b>${p.vehicles_to_prepare} vehicles</b> · Estimated delay avoided: <b>${p.estimated_delay_avoided_min} min</b><br><small>AI action: ${p.recommended_action}. ${p.model}</small>`;
    $("predictionCards").innerHTML=p.zones.map(z=>`<div class="prediction-card ${z.risk.toLowerCase()}"><h3>${z.zone}</h3><div class="forecast"><div>Now<strong>${Math.round(z.current)}%</strong></div><div>15 min<strong>${Math.round(z.in_15_min)}%</strong></div><div>30 min<strong>${Math.round(z.in_30_min)}%</strong></div></div><span class="risk ${z.risk.toLowerCase()}">${z.risk} RISK</span><small style="display:block;color:#667085;margin-top:8px">Current avg speed: ${z.avg_speed} km/h</small></div>`).join("");
  }catch(e){$("predictionSummary").textContent=e.message}
}

async function loadFleet(){
  try{
    let f=await api("/api/fleet-plan");
    $("fleetSummary").innerHTML=`<b>${f.summary}</b><br><small>Bottleneck: ${f.bottleneck} · Spare capacity: ${f.spare_resource}</small>`;
    $("fleetPlan").innerHTML=f.plan.map(x=>`<div class="fleet-row"><div><b>${x.vehicle}</b><br><small>${x.type} · ${x.load}% load</small></div><div class="fleet-action">${x.action}<br><small>${x.reason}</small></div><div><span class="v4-badge">${x.target}</span></div></div>`).join("");
  }catch(e){$("fleetSummary").textContent=e.message}
}
async function loadResourcesForecast(){
  try{
    let r=await api("/api/resource-forecast");
    $("resourceForecast").innerHTML=r.resources.map(x=>`<div class="resource-row"><div class="resource-top"><b>${x.name}</b><span class="resource-risk ${x.risk}">${x.risk} RISK</span></div><div class="forecast" style="margin-top:7px"><div>Now<strong>${x.current}%</strong></div><div>Forecast<strong>${x.forecast}%</strong></div><div>Spare<strong>${x.spare_now}%</strong></div></div><small style="display:block;color:#667085;margin-top:7px">AI action: ${x.action}</small></div>`).join("");
  }catch(e){$("resourceForecast").textContent=e.message}
}
async function loadImpact(){
  try{
    let i=await api("/api/impact");
    $("impactResult").innerHTML=[
      ["Network congestion",i.before.congestion+"%",i.after.congestion+"%","↓ "+i.improvement.congestion+" points"],
      ["Resource utilization",i.before.resource+"%",i.after.resource+"%","↓ "+i.improvement.resource+" points"],
      ["Average delivery ETA",i.before.eta+" min",i.after.eta+" min","↓ "+i.improvement.eta+" min"]
    ].map(x=>`<div class="impact-card"><span>${x[0]}</span><div class="impact-values"><div><small>Before</small><strong>${x[1]}</strong></div><div>→</div><div><small>After AI</small><strong>${x[2]}</strong></div></div><p style="color:#027a48;font-weight:900;margin-bottom:0">${x[3]}</p></div>`).join("");
  }catch(e){$("impactResult").textContent=e.message}
}

async function loadDecisionExplain(){
  try{
    let e=await api("/api/decision-explain");
    $("decisionExplain").innerHTML=`
      <div class="explain-card"><h3>🛣 Route decision</h3><ol>${e.route.map(x=>`<li>${x}</li>`).join("")}</ol></div>
      <div class="explain-card"><h3>🚚 Fleet decision</h3><ol>${e.fleet.map(x=>`<li>${x}</li>`).join("")}</ol></div>
      <div class="explain-card"><h3>🏙 Resource decision</h3><ol>${e.resources.map(x=>`<li>${x}</li>`).join("")}</ol></div>
      <div class="transparency-note"><b>Transparency:</b> ${e.transparency}</div>`;
  }catch(err){$("decisionExplain").textContent=err.message}
}

function setDemoStep(n,title,desc,icon){
  const total=5;
  $("demoProgressBar").style.width=(n/total*100)+"%";
  $("demoStatus").textContent=n<5?"STEP "+n+"/5":"COMPLETE";
  $("demoStatus").className="demo-status "+(n<5?"running":"done");
  $("demoStep").innerHTML=`<div class="demo-icon">${icon}</div><div><h3>${title}</h3><p>${desc}</p></div>`;
}

async function startJudgeDemo(){
  const btn=document.querySelector(".demo-button");
  btn.disabled=true; btn.textContent="⏳ DEMO RUNNING...";
  $("demoActions").innerHTML="";
  try{
    setDemoStep(1,"Detect — identify the bottleneck","UrbanFlow scans the simulated traffic, fleet and capacity signals.","🚦");
    await new Promise(r=>setTimeout(r,900));
    await load();

    setDemoStep(2,"Predict — forecast the next 15–30 minutes","The prediction engine identifies where congestion pressure is expected to rise.","🔮");
    await loadPrediction();
    await new Promise(r=>setTimeout(r,1100));

    setDemoStep(3,"Decide — choose the best intervention","UrbanFlow compares route congestion, ETA, vehicle load and available capacity.","🧠");
    await optimize();
    await loadFleet();
    await loadDecisionExplain();
    await new Promise(r=>setTimeout(r,1200));

    setDemoStep(4,"Act — allocate vehicles and shift capacity","Fleet and resource recommendations are generated from the predicted bottleneck.","🚚");
    await loadResourcesForecast();
    await new Promise(r=>setTimeout(r,1100));

    setDemoStep(5,"Measure — show the expected city impact","The simulator compares the baseline with the projected post-intervention state.","📊");
    await loadImpact();

    $("demoActions").innerHTML=`
      <button class="mini-action" onclick="document.querySelector('.impact-panel').scrollIntoView({behavior:'smooth'})">Jump to impact</button>
      <button class="mini-action" onclick="loadDecisionExplain()">Show AI reasoning</button>
      <button class="mini-action" onclick="startJudgeDemo()">Run again</button>`;
  }catch(e){
    $("demoStatus").textContent="ERROR";
    $("demoStatus").className="demo-status";
    $("demoStep").innerHTML=`<div class="demo-icon">!</div><div><b>Demo stopped</b><p>${e.message}</p></div>`;
  }finally{
    btn.disabled=false; btn.textContent="🎤 START DEMO";
  }
}

function drawChart(){let c=$("chart");if(!c||!data)return;let x=c.getContext("2d");x.clearRect(0,0,c.width,c.height);x.strokeStyle="#d0d5dd";x.beginPath();x.moveTo(45,25);x.lineTo(45,320);x.lineTo(670,320);x.stroke();data.traffic.forEach((t,i)=>{let h=t.congestion/100*250,xx=70+i*120;x.fillStyle="#2563eb";x.fillRect(xx,320-h,70,h);x.fillStyle="#344054";x.font="12px Arial";x.fillText(Math.round(t.congestion)+"%",xx+18,305-h);x.fillText(t.zone.slice(0,12),xx,340)})}

/* =========================================================
   URBANFLOW AI - SUPABASE AUTHENTICATION
   ========================================================= */

const SUPABASE_URL = "https://ffsucyfjmwqonkjafvpf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_WLWgaysB_sXX5-sfqPxt7A_ChkWWAiu";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const SITE_URL = "https://zafarmihal-cyber.github.io/UrbanFlow-SIH/";


/* ---------- AUTH UI ---------- */

function setupAuthUI() {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const app = document.getElementById("app");

    if (!loginForm || !emailInput || !passwordInput || !app) {
        console.error("UrbanFlow Auth: Required login elements not found.");
        return;
    }

    /* Create extra authentication buttons */
    let authExtras = document.getElementById("authExtras");

    if (!authExtras) {

        authExtras = document.createElement("div");
        authExtras.id = "authExtras";

        authExtras.style.marginTop = "12px";
        authExtras.style.display = "flex";
        authExtras.style.gap = "8px";
        authExtras.style.flexWrap = "wrap";

        const signupBtn = document.createElement("button");
        signupBtn.type = "button";
        signupBtn.textContent = "Create Account";
        signupBtn.className = "light";

        const forgotBtn = document.createElement("button");
        forgotBtn.type = "button";
        forgotBtn.textContent = "Forgot Password?";
        forgotBtn.className = "light";

        authExtras.appendChild(signupBtn);
        authExtras.appendChild(forgotBtn);

        loginForm.appendChild(authExtras);

        /* CREATE ACCOUNT */
        signupBtn.addEventListener("click", async () => {

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                alert("Please enter your email and password first.");
                return;
            }

            if (password.length < 6) {
                alert("Password must contain at least 6 characters.");
                return;
            }

            signupBtn.disabled = true;
            signupBtn.textContent = "Creating...";

            const { data, error } = await sb.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: SITE_URL
                }
            });

            signupBtn.disabled = false;
            signupBtn.textContent = "Create Account";

            if (error) {
                alert("Sign up failed: " + error.message);
                return;
            }

            if (data.user && !data.session) {
                alert(
                    "Account created successfully! 📧\n\n" +
                    "Please check your email and click the verification link.\n\n" +
                    "After verification, come back to UrbanFlow and log in."
                );
            } else {
                alert("Account created successfully!");
            }
        });


        /* FORGOT PASSWORD */
        forgotBtn.addEventListener("click", async () => {

            const email = emailInput.value.trim();

            if (!email) {
                alert("Enter your email address first.");
                emailInput.focus();
                return;
            }

            const { error } = await sb.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: SITE_URL
                }
            );

            if (error) {
                alert("Password reset failed: " + error.message);
                return;
            }

            alert(
                "Password reset email sent! 📧\n\n" +
                "Check your email and follow the link to create a new password."
            );
        });
    }


    /* ---------- LOGIN ---------- */

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        const submitButton = loginForm.querySelector(
            'button[type="submit"], button:not(#authExtras button)'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Signing in...";
        }

        const { data, error } = await sb.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "LOGIN";
        }

        if (error) {

            if (
                error.message.toLowerCase().includes("email not confirmed")
            ) {
                alert(
                    "Please verify your email address first. 📧\n\n" +
                    "Check your inbox for the Supabase verification email."
                );
            } else {
                alert("Login failed: " + error.message);
            }

            return;
        }

        showAuthenticatedApp(data.user);
    });
}


/* ---------- SHOW DASHBOARD ---------- */

function showAuthenticatedApp(user) {

    const loginForm = document.getElementById("loginForm");
    const app = document.getElementById("app");

    if (loginForm) {
        loginForm.classList.add("hidden");
    }

    if (app) {
        app.classList.remove("hidden");
    }

    addUserPanel(user);

    console.log(
        "UrbanFlow user logged in:",
        user.email
    );
}


/* ---------- USER PANEL ---------- */

function addUserPanel(user) {

    let panel = document.getElementById("urbanflowUserPanel");

    if (panel) {
        return;
    }

    panel = document.createElement("div");
    panel.id = "urbanflowUserPanel";

    panel.style.position = "fixed";
    panel.style.top = "14px";
    panel.style.right = "18px";
    panel.style.zIndex = "9999";
    panel.style.padding = "8px 12px";
    panel.style.borderRadius = "10px";
    panel.style.background = "rgba(20,25,35,.95)";
    panel.style.color = "white";
    panel.style.fontSize = "12px";
    panel.style.display = "flex";
    panel.style.alignItems = "center";
    panel.style.gap = "10px";

    const emailText = document.createElement("span");

    emailText.textContent = user.email || "User";

    const logoutBtn = document.createElement("button");

    logoutBtn.textContent = "Logout";
    logoutBtn.style.cursor = "pointer";
    logoutBtn.style.padding = "6px 10px";
    logoutBtn.style.borderRadius = "7px";
    logoutBtn.style.border = "none";

    logoutBtn.addEventListener("click", async () => {

        const { error } = await sb.auth.signOut();

        if (error) {
            alert("Logout failed: " + error.message);
            return;
        }

        window.location.reload();
    });

    panel.appendChild(emailText);
    panel.appendChild(logoutBtn);

    document.body.appendChild(panel);
}


/* ---------- CHECK EXISTING SESSION ---------- */

 async function checkUrbanFlowSession() {

    const {
        data: { session },
        error
    } = await sb.auth.getSession();

    if (error) {
        console.error("Session error:", error);
        return;
    }

    if (session && session.user) {

        showAuthenticatedApp(session.user);

    } else {

        const login = document.getElementById("login");
        const app = document.getElementById("app");

        if (login) {
            login.classList.remove("hidden");
        }

        if (app) {
            app.classList.add("hidden");
        }
    }
}


/* ---------- AUTH STATE LISTENER ---------- */

sb.auth.onAuthStateChange((event, session) => {

    console.log("UrbanFlow Auth:", event);

    if (session && session.user) {
        showAuthenticatedApp(session.user);
    }
});


/* ---------- PASSWORD RECOVERY ---------- */

async function handlePasswordRecovery() {

    const hash = window.location.hash;

    if (!hash || !hash.includes("type=recovery")) {
        return;
    }

    const newPassword = prompt(
        "Enter your new UrbanFlow password:"
    );

    if (!newPassword) {
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    const { error } = await sb.auth.updateUser({
        password: newPassword
    });

    if (error) {
        alert("Password update failed: " + error.message);
        return;
    }

    alert(
        "Password changed successfully! 🔐\n\n" +
        "You can now use your new password to log in."
    );

    window.history.replaceState(
        {},
        document.title,
        SITE_URL
    );
}


/* ---------- START AUTH ---------- */

document.addEventListener("DOMContentLoaded", async () => {

    setupAuthUI();

    await checkUrbanFlowSession();

    await handlePasswordRecovery();

});
