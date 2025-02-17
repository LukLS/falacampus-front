import React from 'react';
import './ViewUsers.css';
import '../../components/Style.css';
import { withRouter } from 'react-router-dom';
import Card from '../../components/Card';
import FormGroup from '../../components/FormGroup';
import UsersTable from '../../components/UsersTable'
import UserApiService from '../../services/UserApiService';

class ViewUsers extends React.Component {

    getLoggedUser = () =>{
        return JSON.parse(localStorage.getItem("loggedUser"));
    }
   
    state = {
        userLoger: this.getLoggedUser(),
        isAdmin: this.getLoggedUser().roles[0].name,
        name: '',
        id: '',
        email: '',
        username: '',
        role: '',
        departament: {
            departamentId: 0,
            name: ''
        },
        users: []
    }
    constructor() {
        super();
        this.service = new UserApiService();
    }
    componentDidMount() { 
        this.find();
    }

    delete = (userId) => {
        this.service.delete(userId)
            .then(response => {
                this.find();
            }
            ).catch(error => {
                console.log(error.response);
            }
            );
    }

    edit = (userId) => {
        this.props.history.push(`/updateUser/${userId}`);
    }

   

    find () {
        let params = '?';

        if (this.state.id !== 0) {
            if (params !== '?') {
                params = `${params}&`;
            }

            params = `${params}id=${this.state.id}`;
        }

        if (this.state.name !== '') {
            if (params !== '?') {
                params = `${params}&`;
            }

            params = `${params}name=${this.state.name}`;
        }

        if (this.state.email !== '') {
            if (params !== '?') {
                params = `${params}&`;
            }

            params = `${params}email=${this.state.email}`;
        }

        if (this.state.username !== '') {
            if (params !== '?') {
                params = `${params}&`;
            }

            params = `${params}username=${this.state.username}`;
        }

        if (this.state.role.name !== '') {
            if (params !== '?') {
                params = `${params}&`;
            }

            params = `${params}role=${this.state.role}`;
        }

        if (this.state.departament.id !== 0) {
            if (params !== '?') {
                params = `${params}&`;
            }

            params = `${params}departamentId=${this.state.departamentId}`;
        }
        this.service.find(params)
            .then(response => {
                const users = response.data;
              this.setState({ users });
            }
            ).catch(error => {
                console.log(error.response);
            }
            );
    }

    findAll = () => {
        this.service.findAll()
            .then(response => {
                const users = response.data;
                this.setState({ users });
                console.log(users);
            }
            ).catch(error => {
                console.log(error.response);
            }
            );
    }

    render() {
        return (

            <div className="container">
                <div className='row'>
                    <div className='col-md-12' style={this.styles.colMd12}>
                        <div className="bs-docs-section">
                            <Card title='Usuários'>
                                <form>
                                    <fieldset>
                                        <FormGroup label="Nome:" htmlFor="inputUserName">
                                            <input type="text" className="form-control" id="inputUserName" placeholder="Digite o Nome do Usuário" value={this.state.name} onChange={(e) => { this.setState({ name: e.target.value }) }} />
                                        </FormGroup>

                                        <br />
                                        <button onClick={this.find} type="button" id='idPesquisar' className="btn btn-info">

                                            <i className="pi pi-search"></i> Pesquisar
                                        </button>
                                    
                                    </fieldset>
                                </form>
                            </Card>
                        </div>
                        <br />
                        <div className="row">

                        </div>
                        <br />
                        <div className='row'>
                            <div className='col-lg-12' >
                                <div className='bs-component'>
                                    <UsersTable users={this.state.users}
                                        delete={this.delete}
                                        usuario={this.state.userLoger}
                                        admin={this.state.isAdmin}
                                        edit={this.edit} id="idEdit"/>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        )
    }
    styles = {
        colMd12: {
            position: 'relative'
        }
    }
}

export default withRouter(ViewUsers);