/* Guarda de acesso do index.html. Precisa rodar de forma síncrona,
   antes de qualquer markup visível, para evitar o "flash" do painel
   sem autenticação. Por isso não é um <script type="module">. */
try{
  var a = JSON.parse(localStorage.getItem("nr_painel_auth_v1") || "null");
  if(!a || !a.email){ location.replace("login.html"); }
}catch(e){ location.replace("login.html"); }
