import ApiService, {LOGGED_USER, TOKEN} from './ApiService';
import StorageService from './StorageService';

export class AuthenticationApiService extends ApiService {

    constructor(){
        super('');
        this.storageService = new StorageService();
        this.aa(); 
    }

    aa= () =>{
        if(JSON.parse(localStorage.getItem("loggedUser")) == null){
            let user ={
                name:''
            }
             this.storageService.setItem(LOGGED_USER, user);
        }
    }

    async login(username, password){
        const loginDTO = {
             "username": username,
             "password": password
        };

        try{   
            const response = await this.post('/login', loginDTO);

           const user = response.data.user;
           
            const token = response.data.token;
          
            this.storageService.setItem("user", user)

            this.storageService.setItem(LOGGED_USER, user);
           
            this.storageService.setItem(TOKEN, token);

            this.registerToken(token);
            return user;
        } catch(error){
            return null;
        }
        
    }
    
    // Checa se o token é válido
    isTokenValid(token){
        const rest = this.post('/isValidToken', token);
        if(rest.data == false){
            localStorage.clear();
            window.open("/", '_self');
        } 
        else{
            return rest;
        }
   
    }
    
    //Remove os dados do usuário
    logout(){
        this.storageService.removeItem(LOGGED_USER);
        this.storageService.removeItem(TOKEN);
        
        return this.post('/logout');
    }

    //Retorna o usuário logado armazenado no storageService
    getLoggedUser(){
        return this.storageService.getItem(LOGGED_USER);
    }
    
    //Retorna o token armazenado no storageService
    getToken(){
        return this.storageService.getItem(TOKEN);
    }

    //Pega o usuário logado e o token do storageService e envia o token para a api para checar se é válido
    async isAuthenticated(){
        const user = this.getLoggedUser();
        const token = this.getToken();

        if (!user || !token){
            return false;
        }

        const tokenDTO = {
            "token": token
        }

        const response = await this.isTokenValid(tokenDTO);
        return response.data;
    }

}

export default AuthenticationApiService