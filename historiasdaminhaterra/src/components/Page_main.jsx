import React, { useRef, useContext, useEffect } from 'react';


import downloadAndUpdate from "./streamHandling"
import { AppContext } from "./state"
import GoogleMaps from './GoogleMaps'

import { withStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/core';


const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop - 53)
const MySlider = withStyles({
    root: {
        color: '#3c82ea'

    }
})(Slider);

function Page_main() {

    const myRef = useRef(null)
    const myRef2 = useRef(null)

    const context = useContext(AppContext);

    let state = context.state;


    // useEffect Hook
    useEffect(() => {

        let str = '{"payload": {"land_id": 1878, "articles": [{"headline": "Oeiras Parque", "link": "20030703041717/http://www.aeiou.pt/registos/o/Oeiras_Parque_O_Shopping_da_Linha.html", "date": "2003-07-03 04:17:17"}, {"headline": "Oeiras Mais \u00e0 Frente", "link": "20051104215840/http://www.aeiou.pt/registos/o/Oeiras_Mais_Frente_Blog_Oficial.html", "date": "2005-11-04 21:58:40"}, {"headline": "Kung Fu Shaolin Hong Long", "link": "20051201025159/http://www.aeiou.pt/registos/k/Kung_Fu_Shaolin_Hong_Long_Artes_Marciais_em_Oeiras.html", "date": "2005-12-01 02:51:59"}, {"headline": "IOL Cinema", "link": "20060828042315/http://www.iol.pt/cinema/noticia.php?id=709304&div_id=2922", "date": "2006-08-28 04:23:15"}, {"headline": "R\u00e1dio e Televis\u00e3o de Portugal", "link": "20070205013940/http://www.rtp.pt/desporto/futebolnac/index.php?div_in=iiie&epoca=2006", "date": "2007-02-05 01:39:40"}, {"headline": "IOL Moda", "link": "20070415092112/http://www.iol.pt/modaesocial/noticia.php?id=674398&div_id=2455", "date": "2007-04-15 09:21:12"}, {"headline": "Primeira com\u00e9dia musical de Moita Flores estreia em Oeiras", "link": "20070616123311/http://www.rtp.pt/index.php?headline=63&visual=16", "date": "2007-06-16 12:33:11"}, {"headline": "Comboio gratuito liga esta\u00e7\u00e3o comboio \u00e0 praia da Torre at\u00e9 Setembro", "link": "20070712114249/http://noticias.sapo.pt/lusa/artigo/cLgGJ2Vc00%2FEU4VCqirXMQ.html", "date": "2007-07-12 11:42:49"}, {"headline": "Executivo aprova adjudica\u00e7\u00e3o do prolongamento do Passeio Mar\u00edtimo", "link": "20070714053750/http://noticias.sapo.pt/lusa/artigo/Q2ME76Je7Pl81UC4XgsD9w.html", "date": "2007-07-14 05:37:50"}, {"headline": "Oeiras Golf", "link": "20070812014234/http://www.aeiou.pt/registos/o/Oeiras_Golf__Residence.html", "date": "2007-08-12 01:42:34"}, {"headline": "PSP det\u00e9m quatro suspeitos de roubo de carros e posse ilegal de armas", "link": "20070825151600/http://noticias.sapo.pt/lusa/artigo/gegZmGb9722svvz74diStg.html", "date": "2007-08-25 15:16:00"}, {"headline": "Fogo perto da antiga F\u00e1brica da P\u00f3lvora", "link": "20070826014205/http://noticias.sapo.pt/lusa/artigo/Ru0e107jjQNfIqrtFBZapw.html", "date": "2007-08-26 01:42:05"}, {"headline": "Fogo em Oeiras em fase de rescaldo", "link": "20070826014538/http://noticias.sapo.pt/lusa/artigo/VSrYpW7XJe%2FEdC0Z0J95Lg.html", "date": "2007-08-26 01:45:38"}, {"headline": "Porto Salvo", "link": "20071006010953/http://noticias.sapo.pt/lusa/artigo/%2Fcg27nTfxR%2B0N2PJzE80bw.html", "date": "2007-10-06 01:09:53"}, {"headline": "Apreens\u00e3o de vivenda de Isaltino \u00e9 manchete de estreia do Sol", "link": "20071102222604/http://www.rtp.pt/index.php?article=255016&visual=16", "date": "2007-11-02 22:26:04"}, {"headline": "PSD desafia S\u00f3crates a falar sobre Oeiras", "link": "20071102222744/http://www.rtp.pt/index.php?article=280357&visual=16", "date": "2007-11-02 22:27:44"}, {"headline": "Jornal de Neg\u00f3cios Online", "link": "20071104055014/http://www.jornaldenegocios.pt/default.asp?CpContentId=305104", "date": "2007-11-04 05:50:14"}, {"headline": "Autarquia retira o apoio financeiro ao festival de m\u00fasica", "link": "20080119165830/http://noticias.sapo.pt/lusa/artigo/c50f5ad25f533696db2bbf.html", "date": "2008-01-19 16:58:30"}, {"headline": "Nova ag\u00eancia para internacionalizar n\u00facleos tecnol\u00f3gicos inicia fun\u00e7\u00f5es em Mar\u00e7o", "link": "20080208182559/http://noticias.sapo.pt/lusa/artigo/526466b6fc76a6a6323208.html", "date": "2008-02-08 18:25:59"}, {"headline": "Provedora da Santa Casa de Oeiras nega investiga\u00e7\u00e3o judicial", "link": "20080303150441/http://noticias.sapo.pt/lusa/artigo/3c61fbcb90f71949857c49.html", "date": "2008-03-03 15:04:41"}, {"headline": "Costa e Perestrello querem Lisboa e Oeiras ligadas por metro", "link": "20090926180451/http://www.tvi24.iol.pt/politica/metro-tunel-politica-autarquicas-ps-tvi24/1088258-4072.html", "date": "2009-09-26 18:04:51"}, {"headline": "Roxy Music confirmados no Oeiras Sounds", "link": "20100512203738/http://www.tvi24.iol.pt/musica/gotan-project-roxy-music-oeiras-sounds/1162188-4060.html", "date": "2010-05-12 20:37:38"}, {"headline": "Presidente da comiss\u00e3o de Defesa defende comando da NATO em Oeiras", "link": "20100615212115/http://www.tvi24.iol.pt/politica/nato-oeiras-defesa-ar-arnaut-tvi24/1170185-4072.html", "date": "2010-06-15 21:21:15"}, {"headline": "Ex-candidata do PSD \u00e0 C\u00e2mara de Oeiras aconselha autarca a demitir-se", "link": "20100715030734/http://noticias.sapo.pt/lusa/artigo/11298555.html", "date": "2010-07-15 03:07:34"}, {"headline": "Roxy Music actuam esta quinta-feira no Oeiras Sounds", "link": "20100721221607/http://www.tvi24.iol.pt/musica/oeiras-sounds-roxy-music-bryan-ferry/1179302-4060.html", "date": "2010-07-21 22:16:07"}, {"headline": "Roxy Music no Oeiras Sounds", "link": "20100723160023/http://www.ionline.pt/conteudos/boavida.html", "date": "2010-07-23 16:00:23"}, {"headline": "Roxy Music ao vivo no Oeiras Sounds", "link": "20100723161730/http://www.tvi24.iol.pt/musica/roxy-music-oeiras-sounds-bryan-ferry/1179759-4060.html", "date": "2010-07-23 16:17:30"}, {"headline": "c\u00e2mara abre processo ap\u00f3s morte de crian\u00e7a numa lagoa", "link": "20100803231346/http://www.tvi24.iol.pt/sociedade/oeiras-crianca-lagoa-afogamento-tvi24-barcarena/1182258-4071.html", "date": "2010-08-03 23:13:46"}, {"headline": "C\u00e2mara de Oeiras abre processo de averigua\u00e7\u00f5es sobre morte de crian\u00e7a numa lagoa", "link": "20100806044859/http://www.publico.pt/Local/camara-de-oeiras-abre-processo-de-averiguacoes-sobre-morte-de-crianca-numa-lagoa_1449937", "date": "2010-08-06 04:48:59"}, {"headline": "Miss\u00e3o empresarial da Argentina estuda parcerias com Oeiras Valley", "link": "20101001203638/http://noticias.sapo.pt/lusa/artigo/11582913.html", "date": "2010-10-01 20:36:38"}, {"headline": "Portugal inviabilizar\u00e1 reforma da estrutura de comandos que exclua Oeiras", "link": "20101004152146/http://noticias.sapo.pt/lusa/artigo/11598040.html", "date": "2010-10-04 15:21:46"}, {"headline": "Portugal inviabilizar\u00e1 reforma que exclua comando de Oeiras", "link": "20101004192623/http://www.tvi24.iol.pt/sociedade/nato-oeiras-luis-amado/1196293-4071.html", "date": "2010-10-04 19:26:23"}, {"headline": "Ministro da Defesa italiano acredita que N\u00e1poles manter\u00e1 comando e Oeiras encerrar\u00e1", "link": "20101015003813/http://noticias.sapo.pt/lusa/artigo/11639912.html", "date": "2010-10-15 00:38:13"}, {"headline": "S\u00f3crates acredita que comando da NATO fica em Oeiras", "link": "20101120163304/http://www.tvi24.iol.pt/politica/tvi24-cimeira-nato-socrates-oeiras-comando/1210769-4072.html", "date": "2010-11-20 16:33:04"}, {"headline": "Santos Silva convicto da manuten\u00e7\u00e3o do comando de Oeiras", "link": "20101120170239/http://www.jornaldenegocios.pt/home.php?template=SHOWNEWS_V2&id=454811", "date": "2010-11-20 17:02:39"}, {"headline": "Governo portugu\u00eas quer comando naval fixado em Oeiras", "link": "20101121013025/http://noticias.sapo.pt/lusa/artigo/11792534.html", "date": "2010-11-21 01:30:25"}, {"headline": "PSP corta Marginal entre Pa\u00e7o de Arcos e Alto da Boa Viagem devido a agita\u00e7\u00e3o mar\u00edtima", "link": "20101205183905/http://noticias.sapo.pt/lusa/artigo/11852400.html", "date": "2010-12-05 18:39:05"}, {"headline": "Isaltino Morais anuncia candidatura a Oeiras", "link": "20110128034503/http://www.tsf.pt/paginainicial/interior.aspx?content_id=770570", "date": "2011-01-28 03:45:03"}, {"headline": "\u00daltima homenagem a Carlos Castro hoje em Oeiras", "link": "20110211070845/http://www.dn.pt/inicio/pessoas/interior.aspx?content_id=1776522", "date": "2011-02-11 07:08:45"}, {"headline": "Portugal segura bandeira da NATO em Oeiras", "link": "20110303002209/http://www.jn.pt/PaginaInicial/Nacional/Interior.aspx?content_id=1715221", "date": "2011-03-03 00:22:09"}, {"headline": "Oeiras quer afastamento de Isaltino Morais", "link": "20110504170329/http://www.dn.pt/inicio/portugal/interior.aspx?content_id=1843759&seccao=Sul", "date": "2011-05-04 17:03:29"}, {"headline": "CDU diz que autarca deve abandonar presid\u00eancia da C\u00e2mara de Oeiras", "link": "20110504195348/http://noticias.sapo.pt/lusa/artigo/12499641.html", "date": "2011-05-04 19:53:48"}, {"headline": "PSD quer assegurar estabilidade na C\u00e2mara de Oeiras", "link": "20110504200754/http://www.tvi24.iol.pt/politica/isaltino-oeiras-tribunal-justica-tvi24-psd/1250776-4202.html", "date": "2011-05-04 20:07:54"}, {"headline": "Protesto em frente \u00e0 C\u00e2mara de Oeiras contra as condi\u00e7\u00f5es do canil municipal", "link": "20110513234412/http://www.jn.pt/blogs/osbichos/archive/2011/05/13/protesto-em-frente-224-c-226-mara-de-oeiras-contra-as-condi-231-245-es-do-canil-municipal.aspx", "date": "2011-05-13 23:44:12"}, {"headline": "Portugal n\u00e3o deve conseguir manuten\u00e7\u00e3o de base da NATO em Oeiras", "link": "20110608173237/http://www.tsf.pt/PaginaInicial/Portugal/Interior.aspx?content_id=1872693", "date": "2011-06-08 17:32:37"}, {"headline": "NATO transforma base de Oeiras em comando operacional mar\u00edtimo", "link": "20110609165115/http://www.tsf.pt/PaginaInicial/Portugal/Interior.aspx?content_id=1873741", "date": "2011-06-09 16:51:15"}, {"headline": "Actual Comando Conjunto de Oeiras dever\u00e1 ser substitu\u00eddo por Comando Operacional Mar\u00edtimo", "link": "20110609190437/http://www.dn.pt/inicio/portugal/interior.aspx?content_id=1873389", "date": "2011-06-09 19:04:37"}, {"headline": "Vinda de for\u00e7a mar\u00edtima para Oeiras s\u00f3 faz sentido se Portugal fizer parte", "link": "20110610000126/http://noticias.sapo.pt/lusa/artigo/12663477.html", "date": "2011-06-10 00:01:26"}, {"headline": "Ministros chegam a acordo que substitui comando em Oeiras por comando operacional mar\u00edtimo", "link": "20110610001814/http://noticias.sapo.pt/lusa/artigo/12659842.html", "date": "2011-06-10 00:18:14"}, {"headline": "C\u00e2mara de Oeiras recusa dar esclarecimentos sobre pris\u00e3o de Isaltino Morais", "link": "20110930174657/http://www.ionline.pt/portugal/camara-oeiras-recusa-dar-esclarecimentos-sobre-prisao-isaltino-morais", "date": "2011-09-30 17:46:57"}, {"headline": "CDS de Oeiras exorta vereadores de Oeiras a demitirem-se", "link": "20110930180527/http://www.tvi24.iol.pt/politica/isaltino-isaltino-morais-oeiras-psd-cds-pp-tvi24/1285048-4202.html", "date": "2011-09-30 18:05:27"}, {"headline": "Tribunal de Oeiras decreta liberta\u00e7\u00e3o imediata de Isaltino Morais", "link": "20111001031954/http://www.jornaldenegocios.pt/home.php?template=SHOWNEWS_V2&id=509193", "date": "2011-10-01 03:19:54"}, {"headline": "Isaltino Morais pede afastamento da ju\u00edza do Tribunal de Oeiras", "link": "20111004000120/http://www.ionline.pt/portugal/isaltino-morais-pede-afastamento-da-juiza-tribunal-oeiras", "date": "2011-10-04 00:01:20"}, {"headline": "Magistrada de Oeiras pode mandar prender Isaltino Morais", "link": "20111103205102/http://www.jornaldenegocios.pt/home.php?template=SHOWNEWS_V2&id=516831&pn=1", "date": "2011-11-03 20:51:02"}, {"headline": "Casa de Repouso de Santo Amaro de Oeiras e Padre Cruz", "link": "20120203095804/http://www.aeiou.pt/empresas/Lares-3a-Idade/Casa-de-Repouso-de-Santo-Amaro-de-Oeiras-Padre-Cruz.html", "date": "2012-02-03 09:58:04"}, {"headline": "Moita Flores aceita convite para se candidatar \u00e0 C\u00e2mara de Oeiras", "link": "20120703040307/http://www.ionline.pt/portugal/moita-flores-aceita-convite-se-candidatar-camara-oeiras", "date": "2012-07-03 04:03:07"}, {"headline": "Paulo Freitas do Amaral anuncia candidatura \u00e0 C\u00e2mara Municipal de Oeiras", "link": "20120728033059/http://www.ionline.pt/portugal/paulo-freitas-amaral-anuncia-candidatura-camara-municipal-oeiras", "date": "2012-07-28 03:30:59"}, {"headline": "Tribunal de Contas detecta irregularidades em obras p\u00fablico-privadas da C\u00e2mara de Oeiras", "link": "20130112070810/http://www.jornaldenegocios.pt/economia/autarquias/detalhe/tribunal_de_contas_detecta_irregularidades_em_obras_publico_privadas_da_camara_de_oeiras.html", "date": "2013-01-12 07:08:10"}, {"headline": "Isaltino Morais abriu duas empresas em Mo\u00e7ambique", "link": "20130301231145/http://www.jornaldenegocios.pt/economia/autarquias/detalhe/isaltino_morais_abriu_duas_empresas_em_mocambique.html", "date": "2013-03-01 23:11:45"}, {"headline": "Isaltino Morais perde recurso no Tribunal Constitucional", "link": "20130320180011/http://www.jornaldenegocios.pt/economia/justica/detalhe/isaltino_morais_perde_recurso_no_tribunal_constitucional.html", "date": "2013-03-20 18:00:11"}, {"headline": "C\u00e2mara de Oeiras prepara-se para eventual pris\u00e3o de Isaltino", "link": "20130730233323/http://www.ionline.pt/artigos/camara-oeiras-prepara-se-eventual-prisao-isaltino", "date": "2013-07-30 23:33:23"}, {"headline": "Candidato \u00ed c\u00e2mara de Oeiras \u00e9 principal suspeito na investiga\u00e7\u00e3o \u00ed s PPP locais", "link": "20130802063041/http://www.jornaldenegocios.pt/economia/politica/detalhe/candidato_a_camara_de_oeiras_e_principal_suspeito_na_investigacao_as_ppp_locais.html", "date": "2013-08-02 06:30:41"}, {"headline": "Tribunal de Oeiras declarou-se incompetente para julgar ac\u00e7\u00e3o contra Paulo Vistas", "link": "20130803033750/http://www.ionline.pt/artigos/portugal/tribunal-oeiras-declarou-se-incompetente-julgar-accao-contra-paulo-vistas", "date": "2013-08-03 03:37:50"}, {"headline": "Tribunal de Oeiras absolve arguidos do processo Taguspark", "link": "20130804060003/http://www.jornaldenegocios.pt/economia/justica/taguspark/detalhe/tribunal_de_oeiras_absolve_arguidos_do_processo_taguspark.html", "date": "2013-08-04 06:00:03"}, {"headline": "Isaltino \u00e9 cabe\u00e7a de lista a assembleia municipal de Oeiras", "link": "20130805041734/http://www.jornaldenegocios.pt/economia/politica/detalhe/mesmo_preso_isaltino_e_cabeca_de_lista_a_assembleia_municipal.html", "date": "2013-08-05 04:17:34"}, {"headline": "Isaltino Morais n\u00e3o pode ser candidato \u00ed Assembleia Municipal de Oeiras", "link": "20130813163652/http://www.jornaldenegocios.pt/economia/politica/detalhe/tribunal_isaltino_morais_nao_pode_ser_candidato_a_assembleia_municipal_de_oeiras.html", "date": "2013-08-13 16:36:52"}, {"headline": "Aut\u00e1rquicas Tribunal de Oeiras considera eleg\u00edvel candidatura de Moita Flores", "link": "20130813234614/http://expresso.sapo.pt/autarquicas-tribunal-de-oeiras-considera-elegivel-candidatura-de-moita-flores=f825825", "date": "2013-08-13 23:46:14"}, {"headline": "Movimento recorre da impugna\u00e7\u00e3o da candidatura de Isaltino Morais a Oeiras", "link": "20130818055716/http://www.ionline.pt/artigos/portugal/movimento-recorre-da-impugnacao-da-candidatura-isaltino-morais-oeiras", "date": "2013-08-18 05:57:16"}, {"headline": "Movimento Isaltino Oeiras Mais \u00e0 Frente recorre para o Constitucional", "link": "20130821030233/http://expresso.sapo.pt/movimento-isaltino-oeiras-mais-a-frente-recorre-para-o-constitucional=f826616", "date": "2013-08-21 03:02:33"}, {"headline": "Tribunal rejeita candidatura do CDS-PP a Oeiras", "link": "20130823062006/http://www.ionline.pt/artigos/portugal/autarquicas-tribunal-rejeita-candidatura-cds-pp-oeiras", "date": "2013-08-23 06:20:06"}, {"headline": "Candidatura de Isaltino Morais \u00ed Assembleia Municipal", "link": "20130826165959/http://www.jornaldenegocios.pt/economia/politica/detalhe/vistas_candidatura_de_isaltino_morais_a_assembleia_municipal_e_forma_de_honrar_e_dignificar_o_trabalho_em_oeiras.html", "date": "2013-08-26 16:59:59"}, {"headline": "Constitucional impede candidatura de Isaltino Morais com duas declara\u00e7\u00f5es de voto", "link": "20130913181323/http://www.jornaldenegocios.pt/economia/politica/eleicoes/detalhe/constitucional_impede_candidatura_de_isaltino_morais_com_duas_declaracoes_de_voto.html", "date": "2013-09-13 18:13:23"}, {"headline": "Constitucional impede candidatura de Isaltino a Oeiras", "link": "20130914001107/http://expresso.sapo.pt/constitucional-impede-candidatura-de-isaltino-a-oeiras=f830256", "date": "2013-09-14 00:11:07"}, {"headline": "Aut\u00e1rquicas Constitucional impede candidatura de Isaltino Morais \u00e0 Assembleia Municipal de Oeiras", "link": "20130914222901/http://expresso.sapo.pt/autarquicas-constitucional-impede-candidatura-de-isaltino-morais-a-assembleia-municipal-de-oeiras=f830251", "date": "2013-09-14 22:29:01"}, {"headline": "Marcos S\u00e1 acusa Paulo Vistas de suportar a sua candidatura em Oeiras pelo nome de Isaltino Morais", "link": "20130917043639/http://www.ionline.pt/artigos/portugal/marcos-sa-acusa-paulo-vistas-suportar-sua-candidatura-oeiras-pelo-nome-isaltino", "date": "2013-09-17 04:36:39"}, {"headline": "Moita Flores defende regresso a pol\u00edticas que tornaram Oeiras famosa", "link": "20130917214225/http://www.ionline.pt/artigos/portugal/moita-flores-defende-regresso-politicas-tornaram-oeiras-famosa", "date": "2013-09-17 21:42:25"}, {"headline": "Candidatura de Paulo Vistas festeja em Oeiras", "link": "20130929211343/http://www.jornaldenegocios.pt/economia/politica/eleicoes/detalhe/candidatura_de_paulo_vistas_festeja_em_oeiras.html", "date": "2013-09-29 21:13:43"}, {"headline": "Julgamento da actriz S\u00f3nia Braz\u00e3o come\u00e7a hoje em Oeiras", "link": "20131001171308/http://www.ionline.pt/artigos/portugal/julgamento-da-actriz-sonia-brazao-comeca-hoje-oeiras", "date": "2013-10-01 17:13:08"}, {"headline": "Tribunal confirma dois anos de pris\u00e3o para Isaltino de Morais", "link": "20131112202242/http://www.rtp.pt/noticias/index.php?article=438768&tm=8&layout=121&visual=49", "date": "2013-11-12 20:22:42"}, {"headline": "M\u00fasica Gotan Project tocam hoje em Oeiras", "link": "20131113015257/http://expresso.sapo.pt/musica-gotan-project-tocam-hoje-em-oeiras=f594351", "date": "2013-11-13 01:52:57"}, {"headline": "Moita Flores e Paulo Vistas trocam impugna\u00e7\u00f5es em Oeiras", "link": "20140807072554/http://www.publico.pt/politica/noticia/moita-flores-e-paulo-vistas-trocam-impugnacoes-em-oeiras-1602905", "date": "2014-08-07 07:25:54"}, {"headline": "Isaltino Morais reafirma inoc\u00eancia e diz que n\u00e3o abandona C\u00e2mara de Oeiras", "link": "20140930230635/http://www.rtp.pt/noticias/index.php?article=359858&tm=9&layout=123&visual=61", "date": "2014-09-30 23:06:35"}, {"headline": "Assembleia Municipal de Oeiras aprova SATU at\u00e9 ao Cac\u00e9m", "link": "20141019052610/http://www.publico.pt/local/noticia/assembleia-municipal-de-oeiras-aprova-satu-ate-ao-cacem-1613147", "date": "2014-10-19 05:26:10"}, {"headline": "Tribunal de Oeiras recusa pedido de liberta\u00e7\u00e3o de Isaltino Morais", "link": "20141022142249/http://www.rtp.pt/noticias/index.php?article=646959&tm=8&layout=122&visual=61", "date": "2014-10-22 14:22:49"}, {"headline": "Tribunal Constitucional impede candidatura de Isaltino Morais \u00e0 Assembleia Municipal de Oeiras", "link": "20141022150659/http://www.rtp.pt/noticias/index.php?article=680255&tm=9&layout=121&visual=49", "date": "2014-10-22 15:06:59"}, {"headline": "Isaltino Morais pede suspens\u00e3o mandato da C\u00e2mara de Oeiras", "link": "20141023052640/http://www.jornaldenegocios.pt/economia/politica/detalhe/isaltino_morais_pede_suspensao_mandato_da_camara_de_oeiras.html", "date": "2014-10-23 05:26:40"}, {"headline": "C\u00e2mara de Oeiras inaugura s\u00e1bado Complexo Desportivo de Porto Salvo", "link": "20150117080908/http://www.sabado.pt/ultima_hora/detalhe/camara_de_oeiras_inaugura_sabado_complexo_desportivo_de_porto_salvo.html", "date": "2015-01-17 08:09:08"}, {"headline": "Avenida Marginal em Oeiras reaberta ao tr\u00e2nsito ap\u00f3s acidente com cinco feridos", "link": "20150202202218/http://www.ionline.pt/artigos/portugal/avenida-marginal-oeiras-reaberta-ao-transito-apos-acidente-cinco-feridos", "date": "2015-02-02 20:22:18"}, {"headline": "Acidente com seis feridos corta Avenida Marginal na zona de Oeiras", "link": "20150203004608/http://www.rtp.pt/noticias/index.php?article=801743&tm=8&layout=121&visual=49", "date": "2015-02-03 00:46:08"}, {"headline": "Caetano Veloso e Gilberto Gil juntam-se no cooljazz de Oeiras", "link": "20150317040222/http://www.rtp.pt/noticias/index.php?article=812420&tm=4&layout=121&visual=49", "date": "2015-03-17 04:02:22"}, {"headline": "Ant\u00f3nio Zambujo atua em julho no festival cooljazz em Oeiras", "link": "20150415201457/http://www.rtp.pt/noticias/index.php?article=820439&tm=4&layout=121&visual=49", "date": "2015-04-15 20:14:57"}, {"headline": "Jovem desapareceu na Praia de Santo Amaro de Oeiras", "link": "20150514215840/http://expresso.sapo.pt/sociedade/2015-05-13-Jovem-desapareceu-na-Praia-de-Santo-Amaro-de-Oeiras.-Buscas-foram-suspensas", "date": "2015-05-14 21:58:40"}, {"headline": "Jovem desaparecido em Santo Amaro de Oeiras ainda n\u00e3o apareceu", "link": "20150515012630/http://www.rtp.pt/noticias/index.php?article=828538&tm=8&layout=122&visual=61", "date": "2015-05-15 01:26:30"}, {"headline": "Retomadas buscas para encontrar jovem desaparecido em Santo Amaro de Oeiras", "link": "20150515042809/http://www.dn.pt/inicio/portugal/interior.aspx?content_id=4567151", "date": "2015-05-15 04:28:09"}, {"headline": "Alargada zona de buscas do jovem que desapareceu em Santo Amaro de Oeiras", "link": "20150516013152/http://www.rtp.pt/noticias/index.php?article=828881&tm=8&layout=122&visual=61';



        //FetchSomeLands()

    }, []);

    function appendLeadingZeroes(n) {
        if (n <= 9) {
            return "0" + n;
        }
        return n
    }

    const displayStory = (item, id) => {

        console.log(new Date(item.date));

        let b4 = new Date(state.dates[0], 0, 1, 0, 0, 0, 0);
        let af = new Date(state.dates[1], 11, 21, 23, 59, 59, 0);




        if (new Date(item.date) > b4 && new Date(item.date) < af) {
            return (<div className={id === state.selectedStory ? 'landselected story row' : 'story row'} key={id}>

                <div className='col-2'>  <p className="date">{ShowDate(item.date)}</p></div>
                <div className='col-10 headline animated fadeInUp' onClick={() => {
                    context.dispatch({ type: 'SWITCH_STORY', payload: id });
                    scrollToRef(myRef);

                }
                } style={{ textAlign: "left" }}> <div >{item.headline}</div></div>
            </div>)
        }


        else {
            return null;
        }
    }

    function ShowDate(date) {

        let current_datetime = new Date(date)
        console.log(current_datetime.toString());
        let formatted_date = appendLeadingZeroes(current_datetime.getDate()) + "/" + appendLeadingZeroes(current_datetime.getMonth() + 1) + "/" + current_datetime.getFullYear()
        return formatted_date

    }

    /*const handleChange = (event, newValue) => {
        context.dispatch({ type: 'CHANGE_DATE', payload: newValue });
    };*/


    function ChangeStory(val) {

        let b4 = new Date(state.dates[0], 0, 1, 0, 0, 0, 0);
        let af = new Date(state.dates[1], 11, 21, 23, 59, 59, 0);

        let newid = state.selectedStory + val
        if (newid > state.lands[state.selectedLand].news.length - 1) {
            newid = state.lands[state.selectedLand].news.length - 1;
        } else if (newid < 0) {
            newid = 0
        }

        let newdate = new Date(state.lands[state.selectedLand].news[newid].date)
        if (newdate > b4 && newdate < af) {
            context.dispatch({ type: 'SWITCH_STORY', payload: newid });
        }




    }


    const handleChange = (event, newValue) => {
        //console.log(newValue);

        context.dispatch({ type: 'CHANGE_DATE', payload: newValue });
        //setValue(newValue);
    };

    const changesDatesButtons = (change) => {


        let arr = state.dates.slice();
        arr[0] = arr[0] + change;
        arr[1] = arr[1] + change;
        if (arr[0] < 1996) arr[0] = 1996;
        if (arr[1] > 2020) arr[1] = 2020;
        if (arr[1] < 1996) arr[0] = 1996;
        if (arr[0] > 2020) arr[1] = 2020;


        context.dispatch({ type: 'CHANGE_DATE', payload: arr });
    }




    let boundstr = state.queriedbounds.join(';')
    let specialurl = 'http://localhost:5000/api/downloaddetails?bounds=' + boundstr

    return (
        <React.Fragment>

            <div className="container">


            </div>
            <div id='map'>
                <GoogleMaps />

                <button type="button" onClick={() => FetchSomeLands()} className="btn btn-primary gradient maplook">Procurar Notícias nesta região</button>
            </div>
            <div ref={myRef2} className="container newscont" >
                <h3>Histórias encontradas nesta zona</h3>
                <div className="row">
                    <div className='col-3'>
                        <h5 style={{ textAlign: "left" }} className="animated fadeInUp">Datas</h5>
                        <br /><br />
                        <div className="row">
                            <div className="col-8">
                                <MySlider
                                    defaultValue={[1996, 2020]}
                                    value={state.dates.slice()}
                                    min={1996}
                                    step={1}
                                    onChange={handleChange}
                                    max={2020}
                                    aria-labelledby="range-slider"
                                    valueLabelDisplay="on"
                                />
                            </div>
                            <div className="col-3"><div className="btn-group datebtns" role="group" aria-label="Basic example">
                                <button type="button" onClick={() => changesDatesButtons(-1)} className="btn btn-primary"><i className="material-icons">chevron_left</i></button>
                                <button type="button" onClick={() => changesDatesButtons(1)} className="btn btn-primary"><i className="material-icons">chevron_right</i></button>
                            </div></div>
                        </div>



                        <h5 style={{ textAlign: "left" }} className="animated fadeInUp">Terras</h5>

                        <div className='Lands'>
                            {state.lands.length === 0 && <p style={{ textAlign: "left", opacity: 0.4 }}>Procure numa região para ver terras</p>}
                            {state.lands.map((item, id) => {

                                return (<div className={id === state.selectedLand ? 'landselected land' : 'land'} key={id} onClick={() => { context.dispatch({ type: 'SEE_LAND_NEWS', payload: id }) }
                                }> <p style={{ textAlign: "left" }} className="animated fadeInUp">{item.name}</p></div>)
                            })}

                        </div>
                        <br />
                        {state.queriedbounds.length === 4 &&
                            <a type="button" href={specialurl} className="btn btn-primary downloadbtn">Descarregar Histórias <i className="fas fa-file-download"></i></a>}

                    </div>
                    <div className="col-9">

                        <div className="row">
                            <div className='col-2'></div>
                            <div className='col-10'>
                                <h5>Histórias</h5></div>
                        </div>
                        <div className="histcontainer">
                            {state.selectedLand === -1 &&
                                <div className="row">

                                    <div className='col-2'> </div>
                                    <div className='col-10'> <p style={{ textAlign: "left", opacity: 0.4 }}>Selecione uma terra para ver as suas histórias</p></div>
                                </div>
                            }


                            {state.selectedLand !== -1 && state.lands[state.selectedLand].news !== undefined && state.lands[state.selectedLand].news.map((item, id) => { return displayStory(item, id) })}
                        </div>
                    </div>

                    <div className="col-6"></div>

                </div>

            </div>
            <br />
            <br />
            <br />
            <div ref={myRef} className="exsitediv extSite">

                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            <h5>História Escolhida</h5>
                        </div><div className="col-2">
                        </div>

                        {state.selectedLand !== -1 && state.selectedStory !== -1 && state.lands[state.selectedLand].news !== undefined &&
                            <div className="col-6">
                                <div className="btn-group mr-2" role="group" aria-label="Basic example">

                                    <button type="button" onClick={() => ChangeStory(-1)} className="btn btn-primary"><i className="fas fa-chevron-left"></i> Anterior</button>
                                    <button type="button" onClick={() => ChangeStory(1)} className="btn btn-primary">Próxima <i className="fas fa-chevron-right"></i></button>
                                </div>

                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <a className="btn btn-primary mr-2" target="_blank" rel="noopener noreferrer" href={`https://arquivo.pt/wayback/${state.lands[state.selectedLand].news[state.selectedStory].link}`}>Abrir no arquivo.pt <i className="fas fa-globe"></i></a>
                                </div>

                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button onClick={() => scrollToRef(myRef2)} className="btn btn-primary">Procurar outra <i className="fas fa-chevron-up"></i></button>
                                </div>
                            </div>}
                    </div>
                </div>
                <br />
                <div className="iframedivv">
                    {(state.selectedLand === -1 || state.selectedStory === -1) &&
                        <div className="big"><p>Selecione Uma História</p></div>}
                    {state.selectedLand !== -1 && state.selectedStory !== -1 && state.lands[state.selectedLand].news !== undefined &&
                        <div className="iframecontainer">


                            <iframe className="" scrolling="yes" title="externalsite" src={`https://arquivo.pt/noFrame/replay/${state.lands[state.selectedLand].news[state.selectedStory].link}`}></iframe>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment >

    );


    function FetchSomeLands() {
        let boundstr = state.bounds.join(';')

        console.log('FETCHING LANDS NOW');

        let url = 'http://localhost:5000/api/artigosaqui?bounds=' + boundstr
        console.log(url);


        context.dispatch({ type: 'CHANGE_QUERYBOUNDS', payload: state.bounds });

        downloadAndUpdate(url, context)

    }





}
export default Page_main