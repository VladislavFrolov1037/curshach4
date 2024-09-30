import React from 'react';
import {fetchFromApi} from "../services/api";

function Home() {
    return (
        <div>
            <h1>Регистрация</h1>
            <form action="" className="">
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Почта</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Пароль</label>
                    <input type="password" className="form-control" id="exampleInputPassword1"/>
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div>
                <button className="btn btn-primary w-100">Зарегистрироваться</button>
            </form>
        </div>
    );
}

export default Home;