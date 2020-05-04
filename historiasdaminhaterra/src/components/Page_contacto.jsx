
import React from 'react';

function Page_contacto() {
    return (
        <div className="container-small contpadd info">
            <div class="card">
                <div class="card-body">
                    <h4>Contacto</h4>
                    <p>Este projeto foi desenvolvida na íntegra por mim João Ramiro</p>
                    <img className="me" src="/joaoramiro.png"></img>
                    <br />
                    <p>Para dúvidas, sugestões e feedbacks é favor contactar através de: <a href="mailto:mail@joaoramiro.pt"><b>mail@joaoramiro.pt</b></a></p>
                    <p>Eis outras plataformas onde me podem encontrar</p><p className="networks">
                        <a href="https://github.com/DonHaul">
                            <i class="fab fa-github-square"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/joaoramiro/"><i class="fab fa-linkedin"></i></a>
                        <a href="https://www.instagram.com/joao__ramiro/"><i class="fab fa-instagram-square"></i></a>
                        <a href="https://www.joaoramiro.pt/"><i class="fas fa-globe"></i></a>

                    </p>
                </div>
            </div>
        </div>)
}


export default Page_contacto