
import React from 'react';

function Page_sobre() {
    return (
        <div className="container-small contpadd info">
            <div class="card">
                <div class="card-body">
                    <h1>Sobre</h1>

                    <img style={{ margin: "0 auto", display: "block" }} src="/histterra.png" />

                    <h4>O que é o histórias da minha terra?</h4>
                    <p>O Histórias da minha terra é uma plataforma desenvolvida no âmbito do concurso <a href="https://sobre.arquivo.pt/en/collaborate/arquivo-pt-award-2020/">Prémio Arquivo 2020</a>, que permite a qualquer uns pesquisar artigos preservados relevantes na região de Portugal Escolhida fornecidas pelo <a href="https://arquivo.pt/">Arquivo.pt</a>. Com o histórias da minha terra é possível a qualquer cidadão pesquisar artigos e páginas do artigo de uma forma inovadora e intuitiva</p>



                    <h4>Como Funciona?</h4>
                    <p>1) Escolha a região do mapa para onde pretende encontrar notícias e carregue "Procurar"<br />
                    2) Selecione o concelho para que pretende visualizar histórias<br />
                    3) Selecione o intervalo de tempo entre o qual essas histórias foram publicadas<br />
                    4) Selecione a história que pretende visualizar :^)</p>

                    <h4>Contribuições</h4>
                    <p>1)	Juntar as capacidades de arquivação temporal do arquivo.pt, com as capacidades de pesquisa geográfica de um mapa de forma a facilitar a procura de notícias regionais.<br />
2)	Ter uma plataforma online, acessível a qualquer um, que permita a procura forma rápida interativa e lúdica de notícias na sua região.<br />
3)	Possibilitar a exportação dos resultados provenientes do arquivo.pt sobre a forma de um ficheiro excel, de forma a permitir uma posterior análise mais metódica dos resultados.<br />
4)	Contribuir para o aumento da visibilidade do arquivo.pt como fonte relevante de páginas web, para a criação de ferramentas e soluções impactantes na sociedade.
</p>

                    <h4>Portais de Notícias</h4>
                    <p>Foram usadas as seguintes fontes de notícias</p>
                    <div className="row">
                        <div className="col-3">
                            <a href="http://publico.pt/">Público</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.jornaldenegocios.pt/">Jornal de Negócios</a>
                        </div>
                        <div className="col-3">
                            <a href="http://abola.pt/">A Bola</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.jn.pt/">Jornal de Notícias</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.lux.iol.pt/">Lux</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.ionline.pt/">Jornal i</a>
                        </div>
                        <div className="col-3">
                            <a href="http://news.google.pt/">Google Notícias</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.aeiou.pt/">AEIOU</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.tsf.pt/">TSF</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.cmjornal.pt/">Correio da Manhã</a>
                        </div>
                        <div className="col-3">
                            <a href="http://expresso.sapo.pt/">Expresso</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.dinheirovivo.pt/">Dinheiro Vivo</a>
                        </div>
                        <div className="col-3">
                            <a href="http://meiosepublicidade.pt/">Meios & Publicidade</a>
                        </div>
                        <div className="col-3">
                            <a href="http://economico.sapo.pt/">Jornal Económico</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.sabado.pt/">Sábado</a>
                        </div>
                        <div className="col-3">
                            <a href="http://noticias.sapo.pt/">Notícias SAPO</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.dn.pt/">Diário de Notícias</a>
                        </div>
                        <div className="col-3">
                            <a href="http://dnoticias.pt/">DNotícias</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.rtp.pt/">RTP</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.iol.pt/">IOL</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.tvi24.iol.pt/">TVI24</a>
                        </div>
                        <div className="col-3">
                            <a href="http://sicnoticias.sapo.pt/">Sic Notícias</a>
                        </div>
                        <div className="col-3">
                            <a href="http://www.sapo.pt/">SAPO</a>
                        </div>
                        <div className="col-3">
                            <a href="http://sol.sapo.pt/">Sol</a>
                        </div>





                    </div>
                    <h4>Agradecimentos</h4>
                    <p>A equipa do <i>Histórias da Minha Terra</i> gostaria de agradecer ao <a href="https://arquivo.pt/">Arquivo.pt</a> pela disponibilidade ínfima de resultados e ao <a href="https://github.com/LIAAD/TemporalSummarizationFramework">LIAAD</a> pela disponibilização de uma ferramenta open-source que facilitou bastante a obtenção de grandes quantidades de páginas do arquivo.pt e pelas sua capacidades ferramenta <i>YAKE</i> com capacidade de selecionar as notícias mais relevantes.</p>
                </div>
            </div>
        </div>

    )
}


export default Page_sobre