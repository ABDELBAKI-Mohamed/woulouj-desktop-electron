import{d as i,r as p,Z as u,$ as r,u as a,a as d,c as m,a0 as c}from"./entry.1b4632b8.js";const f=["disabled","placeholder","type"],b=i({__name:"UiInput",props:{Type:{},Value:{},Placeholder:{},Disable:{type:Boolean}},emits:["on:input"],setup(t){const{Value:s}=t,e=p(s??"");return(l,n)=>u((d(),m("input",{disabled:l.Disable,onInput:n[0]||(n[0]=o=>l.$emit("on:input",a(e))),class:"px-2 py-1 h-10 focus:outline-0 transition-all duration-200 focus:placeholder-a w-full border-2 rounded-md","onUpdate:modelValue":n[1]||(n[1]=o=>c(e)?e.value=o:null),placeholder:l.Placeholder,type:l.Type??"text"},null,40,f)),[[r,a(e)]])}});export{b as _};
