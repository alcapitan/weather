/* Metadata */

const atuiSearchservices_Metadata = {
     name : "Search Service",
     author : "alcapitan (on GitHub)",
     version : "developer branch",
     website : "https://github.com/alcapitan/atui",
}
// atuiKernel_MetadataDisplay(atuiSearchservices_Metadata);


/* Display search elements */

function atuiSearchservices_HeaderDevelop(element,wish)
{
     atuiSearchservices_HeaderBar = document.getElementById('atuiSearchservices_HeaderBar');
     atuiSearchservices_HeaderPropositions = document.getElementById('atuiSearchservices_HeaderPropositions');
     atuiSearchservices_HeaderBarInput = document.getElementById('atuiSearchservices_Input');
     if (!wish)
     {
          atuiSearchservices_HeaderBar.style.width = "100%";
          atuiSearchservices_HeaderBar.style.margin = "0px";
          if (document.documentElement.clientWidth < 767)
          {
               atuiSearchservices_HeaderBar.style.backgroundColor = "transparent";
               atuiSearchservices_HeaderBarInput.style.display = "none";
          }
          atuiSearchservices_HeaderPropositions.style.display = "none";
          element.style.position = "initial";
          element.style.left = "";
          element.style.right = "";
          element.style.backgroundColor = "transparent";
          element.style.boxShadow = "none";
     }
     else
     {
          atuiSearchservices_HeaderBar.style.width = "calc(100% - 20px)";
          atuiSearchservices_HeaderBar.style.margin = "10px";
          atuiSearchservices_HeaderPropositions.style.display = "block";
          element.style.position = "absolute";
          if (document.documentElement.clientWidth < 767)
          {
               atuiSearchservices_HeaderBarInput.style.display = "inline";
               atuiSearchservices_HeaderBar.style.backgroundColor = "var(--atuiKernel_ColorschemeOB1)";
               element.style.left = "40px";
               element.style.right = "40px";
          }
          element.style.backgroundColor = "var(--atuiKernel_ColorschemeOA3)";
          element.style.boxShadow = "var(--atuiKernel_Shadow)";
     }
}

document.getElementById("atuiSearchservices_Header").addEventListener("mouseenter",function(){atuiSearchservices_HeaderDevelop(this,true);});
document.getElementById("atuiSearchservices_Header").addEventListener("mouseleave",function(){atuiSearchservices_HeaderDevelop(this,false);});


/* Propositions */

const atuiSearchservices_HeaderPropositionsRecentsInfos = [["satisfied drop room","https://www.at.ma"],["era assumption grow","https://www.at.ma"],["score wheel shaft","https://www.at.ma"],["veil crossing inhabitant","https://www.at.ma"],["ratio spoil freedom","https://www.at.ma"]];
const atuiSearchservices_HeaderPropositionsSuggestedInfos = [["charter gutter merit","https://www.at.ma"],["meaning presidency maze","https://www.at.ma"],["different federation zone","https://www.at.ma"],["realize praise doctor","https://www.at.ma"],["network atmosphere last","https://www.at.ma"]];

function atuiSearchservices_HeaderPropositionsGenerate(recent,suggested)
{
     try /* Recent searches */
     {
          atuiSearchservices_HeaderPropositionsRecentsInfosContainer = document.getElementById("atuiSearchservices_HeaderPropositionsRecentsContainer");
          atuiSearchservices_HeaderPropositionsRecentsInfosContainer.innerHTML = "";
          for (let counter in recent)
          {
               const atuiSearchservices_HeaderPropositionsRecentsInfosNewlink = document.createElement("a");
               const atuiSearchservices_HeaderPropositionsRecentsInfosNewlinkText = document.createTextNode(recent[counter][0]);
               atuiSearchservices_HeaderPropositionsRecentsInfosNewlink.appendChild(atuiSearchservices_HeaderPropositionsRecentsInfosNewlinkText);
               atuiSearchservices_HeaderPropositionsRecentsInfosNewlink.setAttribute("href",recent[counter][1]);
               atuiSearchservices_HeaderPropositionsRecentsInfosContainer.appendChild(atuiSearchservices_HeaderPropositionsRecentsInfosNewlink);
          }
     }
     catch{}
     try /* Suggested searches */
     {
          atuiSearchservices_HeaderPropositionsSuggestedInfosContainer = document.getElementById("atuiSearchservices_HeaderPropositionsSuggestedContainer");
          atuiSearchservices_HeaderPropositionsSuggestedInfosContainer.innerHTML = "";
          for (let counter in suggested)
          {
               if (suggested[counter] != "")
               {
                    const atuiSearchservices_HeaderPropositionsSuggestedInfosNewlink = document.createElement("p");
                    atuiSearchservices_HeaderPropositionsSuggestedInfosNewlink.innerHTML = suggested[counter][0];
                    atuiSearchservices_HeaderPropositionsSuggestedInfosNewlink.addEventListener("click",function(){sendRequest(suggested[counter][1])});
                    atuiSearchservices_HeaderPropositionsSuggestedInfosContainer.appendChild(atuiSearchservices_HeaderPropositionsSuggestedInfosNewlink);
               }
          }
     }
     catch{}
}

