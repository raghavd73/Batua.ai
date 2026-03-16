import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function StockDetailsPage() {

const [tab,setTab] = useState("overview")

const location = useLocation()
const navigate = useNavigate()

const stock = location.state?.stock

const symbol = stock?.ticker_symbol || "MRPL"
const company = stock?.company_name || "Mangalore Refinery And Petrochemicals"
const price = stock?.price || "195.95"

return (

<div style={styles.page}>

{/* HEADER */}

<div style={styles.header}>

<button
style={styles.back}
onClick={()=>navigate(-1)}
>
←
</button>

<div>
<div style={styles.symbol}>{symbol}</div>
<div style={styles.price}>
₹{price}
<span style={styles.green}> +17.66 (9.91%)</span>
</div>
</div>

</div>


{/* COMPANY */}

<div style={styles.company}>

<img
src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Mangalore_Refinery_logo.svg/120px-Mangalore_Refinery_logo.svg.png"
style={{width:40}}
/>

<div>

<div style={styles.companyName}>
{company}
</div>

<div style={styles.bigPrice}>₹{price}</div>

<div style={styles.green}>+17.81 (10.00%)</div>

</div>

</div>


{/* CHART */}

<div style={styles.chart}>

<div style={styles.chartPlaceholder}>
Stock Chart
</div>

<div style={styles.range}>

{["1D","1W","1M","3M","6M","1Y","5Y","ALL"].map(r=>(
<button key={r} style={styles.rangeBtn}>
{r}
</button>
))}

</div>

</div>


{/* TABS */}

<div style={styles.tabs}>

{["overview","technicals","news","events"].map(t=>(

<button
key={t}
style={tab===t ? styles.activeTab : styles.tab}
onClick={()=>setTab(t)}
>

{t.toUpperCase()}

</button>

))}

</div>


{/* CONTENT */}

{tab==="overview" && <OverviewSection/>}
{tab==="technicals" && <TechnicalsSection/>}
{tab==="events" && <EventsSection/>}


{/* ACTION BAR */}

<div style={styles.actions}>

<button style={styles.sip}>
SIP
</button>

<button style={styles.sell}>
Sell
</button>

<button style={styles.buy}>
Buy
</button>

</div>

</div>

)
}



function OverviewSection(){

return(

<div>

<section style={styles.card}>

<h3>Performance</h3>

<div style={styles.row}>
<span>Today's Low</span>
<span>Today's High</span>
</div>

<div style={styles.rangeBar}></div>

<div style={styles.row}>
<span>52 Week Low</span>
<span>52 Week High</span>
</div>

<div style={styles.rangeBar}></div>

<div style={styles.stats}>

<div>
Open
<br/>
178.10
</div>

<div>
Prev Close
<br/>
178.14
</div>

<div>
Volume
<br/>
5,45,60,684
</div>

</div>

</section>


<section style={styles.card}>

<h3>Market Depth</h3>

<div style={styles.depthBar}></div>

<div style={styles.depthTable}>

<div>Bid</div>
<div>Qty</div>
<div>Ask</div>
<div>Qty</div>

<div>195.74</div>
<div>535</div>
<div>195.86</div>
<div>178</div>

<div>195.73</div>
<div>203</div>
<div>195.87</div>
<div>414</div>

</div>

</section>


<section style={styles.card}>

<h3>Fundamentals</h3>

<div style={styles.grid}>

<div>Mkt Cap<br/>₹31,196Cr</div>
<div>ROE<br/>7.78%</div>
<div>P/E Ratio<br/>14.32</div>
<div>EPS<br/>12.43</div>
<div>P/B Ratio<br/>2.34</div>
<div>Book Value<br/>75.99</div>

</div>

</section>

</div>

)
}



function TechnicalsSection(){

return(

<div>

<section style={styles.card}>

<h3>Summary</h3>

<div style={{color:"#059669",fontSize:18}}>
Bullish
</div>

</section>


<section style={styles.card}>

<h3>Indicators</h3>

<div style={styles.grid}>

<div>RSI</div>
<div>54.63</div>

<div>MACD</div>
<div>-2.00</div>

<div>Beta</div>
<div>1.21</div>

</div>

</section>

</div>

)
}



function EventsSection(){

return(

<section style={styles.card}>

<h3>Events</h3>

<div>11 Mar – Dividend ₹4</div>
<div>03 Mar – Dividend announced</div>
<div>15 Jan – Quarterly results</div>

</section>

)

}



const styles={

page:{
background:"#ffffff",
color:"#111",
minHeight:"100vh",
padding:20,
fontFamily:"Inter, sans-serif"
},

header:{
display:"flex",
alignItems:"center",
gap:12,
marginBottom:10
},

back:{
border:"none",
background:"transparent",
fontSize:20,
cursor:"pointer"
},

symbol:{
fontWeight:800
},

price:{
fontSize:14
},

green:{
color:"#059669",
marginLeft:6
},

company:{
display:"flex",
gap:12,
alignItems:"center",
marginBottom:20
},

companyName:{
fontSize:14,
opacity:.7
},

bigPrice:{
fontSize:28,
fontWeight:800
},

chart:{
marginBottom:20
},

chartPlaceholder:{
height:200,
background:"#f1f5f9",
borderRadius:12,
display:"flex",
alignItems:"center",
justifyContent:"center"
},

range:{
display:"flex",
gap:10,
marginTop:10
},

rangeBtn:{
background:"#f1f5f9",
border:"none",
padding:"6px 12px",
borderRadius:6,
cursor:"pointer"
},

tabs:{
display:"flex",
gap:14,
marginBottom:20
},

tab:{
background:"none",
border:"none",
color:"#6b7280",
fontWeight:600
},

activeTab:{
background:"none",
borderBottom:"2px solid #0891b2",
color:"#111",
fontWeight:700
},

card:{
background:"#ffffff",
padding:16,
borderRadius:12,
marginBottom:16,
border:"1px solid #e5e7eb"
},

row:{
display:"flex",
justifyContent:"space-between"
},

rangeBar:{
height:6,
background:"#10b981",
margin:"10px 0",
borderRadius:3
},

stats:{
display:"flex",
justifyContent:"space-between",
marginTop:10
},

depthBar:{
height:6,
background:"linear-gradient(90deg,#10b981 50%, #ef4444 50%)",
borderRadius:4,
marginBottom:10
},

depthTable:{
display:"grid",
gridTemplateColumns:"1fr 1fr 1fr 1fr",
gap:6,
fontSize:13
},

grid:{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:10
},

actions:{
position:"fixed",
bottom:0,
left:0,
right:0,
display:"flex"
},

sip:{
flex:1,
background:"#f1f5f9",
padding:16,
border:"none"
},

sell:{
flex:2,
background:"#ef4444",
color:"white",
border:"none",
padding:16
},

buy:{
flex:2,
background:"#10b981",
color:"white",
border:"none",
padding:16
}

}