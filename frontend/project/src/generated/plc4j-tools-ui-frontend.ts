/* tslint:disable */
/* eslint-disable */

export interface HttpClient<O> {

    request<R>(requestConfig: { method: string; url: string; queryParams?: any; data?: any; copyFn?: (data: R) => R; options?: O; }): RestResponse<R>;
}

export class RestApplicationClient<O> {

    constructor(protected httpClient: HttpClient<O>) {
    }

    /**
     * HTTP GET /api/application/modules
     * Java method: com.toddysoft.ui.modules.controller.ApplicationController.applicationModules
     */
    applicationModules(options?: O): RestResponse<FrontendModule[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/application/modules`, options: options });
    }

    /**
     * HTTP GET /api/application/user
     * Java method: com.toddysoft.ui.modules.controller.ApplicationController.authenticatedUser
     */
    authenticatedUser(options?: O): RestResponse<User> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/application/user`, options: options });
    }

    /**
     * HTTP POST /api/auth/login
     * Java method: com.toddysoft.ui.security.controller.AuthenticationController.authenticate
     */
    authenticate(arg0: LoginUserDto, options?: O): RestResponse<LoginResponse> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/auth/login`, data: arg0, options: options });
    }

    /**
     * HTTP POST /api/auth/register
     * Java method: com.toddysoft.ui.security.controller.RegistrationController.register
     */
    register(arg0: RegisterUserDto, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/auth/register`, data: arg0, options: options });
    }

    /**
     * HTTP POST /api/auth/reset-password
     * Java method: com.toddysoft.ui.security.controller.AuthenticationController.resetPassword
     */
    resetPassword(arg0: ResetPasswordDto, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/auth/reset-password`, data: arg0, options: options });
    }

    /**
     * HTTP POST /api/contact
     * Java method: com.toddysoft.ui.contact.controller.ContactController.sendContactRequest
     */
    sendContactRequest(arg0: ContactForm, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/contact`, data: arg0, options: options });
    }

    /**
     * HTTP POST /api/permission
     * Java method: com.toddysoft.ui.permissions.controller.PermissionController.savePermission
     */
    savePermission(arg0: Permission, options?: O): RestResponse<Permission> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/permission`, data: arg0, options: options });
    }

    /**
     * HTTP GET /api/permissions
     * Java method: com.toddysoft.ui.permissions.controller.PermissionController.listPermissions
     */
    listPermissions(options?: O): RestResponse<Permission[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/permissions`, options: options });
    }

    /**
     * HTTP DELETE /api/role
     * Java method: com.toddysoft.ui.security.controller.RoleController.deleteRole
     */
    deleteRole(arg0: Role, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/role`, data: arg0, options: options });
    }

    /**
     * HTTP POST /api/role
     * Java method: com.toddysoft.ui.security.controller.RoleController.saveRole
     */
    saveRole(arg0: Role, options?: O): RestResponse<Role> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/role`, data: arg0, options: options });
    }

    /**
     * HTTP GET /api/roles
     * Java method: com.toddysoft.ui.security.controller.RoleController.listRoles
     */
    listRoles(options?: O): RestResponse<Role[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/roles`, options: options });
    }

    /**
     * HTTP DELETE /api/user
     * Java method: com.toddysoft.ui.security.controller.UserController.deleteUser
     */
    deleteUser(arg0: User, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/user`, data: arg0, options: options });
    }

    /**
     * HTTP POST /api/user
     * Java method: com.toddysoft.ui.security.controller.UserController.saveUser
     */
    saveUser(arg0: User, options?: O): RestResponse<User> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/user`, data: arg0, options: options });
    }

    /**
     * HTTP GET /api/users
     * Java method: com.toddysoft.ui.security.controller.UserController.listUsers
     */
    listUsers(options?: O): RestResponse<User[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/users`, options: options });
    }
}

export interface ContactForm {
    email: string;
    message: string;
    name: string;
    subject: string;
}

export interface FrontendModule {
    icon: string;
    moduleComponentName: string;
    moduleUrl: string;
    name: string;
    routerUrl: string;
    sort: number;
    type: string;
}

export interface GrantedAuthority extends Serializable {
    authority: string;
}

export interface LoginResponse {
    expiresIn: number;
    token: string;
}

export interface LoginUserDto {
    email: string;
    password: string;
}

export interface Permission {
    actionName: string;
    id: number;
    moduleName: string;
    rule: string;
}

export interface RegisterUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    sex: Sex;
}

export interface ResetPasswordDto {
    email: string;
    password: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface Serializable {
}

export interface User extends UserDetails {
    city: string;
    country: string;
    createdAt: Date;
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    phone: string;
    roles: Role[];
    sex: Sex;
    size: number;
    street: string;
    updatedAt: Date;
    zip: string;
}

export interface UserDetails extends Serializable {
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    authorities: GrantedAuthority[];
    credentialsNonExpired: boolean;
    enabled: boolean;
    password: string;
    username: string;
}

export type RestResponse<R> = Promise<Axios.GenericAxiosResponse<R>>;

export type Sex = "MALE" | "FEMALE";

function uriEncoding(template: TemplateStringsArray, ...substitutions: any[]): string {
    let result = "";
    for (let i = 0; i < substitutions.length; i++) {
        result += template[i];
        result += encodeURIComponent(substitutions[i]);
    }
    result += template[template.length - 1];
    return result;
}


// Added by 'AxiosClientExtension' extension

import axios from "axios";
import * as Axios from "axios";

declare module "axios" {
    export interface GenericAxiosResponse<R> extends Axios.AxiosResponse {
        data: R;
    }
}

class AxiosHttpClient implements HttpClient<Axios.AxiosRequestConfig> {

    constructor(private axios: Axios.AxiosInstance) {
    }

    request<R>(requestConfig: { method: string; url: string; queryParams?: any; data?: any; copyFn?: (data: R) => R; options?: Axios.AxiosRequestConfig; }): RestResponse<R> {
        function assign(target: any, source?: any) {
            if (source != undefined) {
                for (const key in source) {
                    if (source.hasOwnProperty(key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        }

        const config: Axios.AxiosRequestConfig = {};
        config.method = requestConfig.method as typeof config.method;  // `string` in axios 0.16.0, `Method` in axios 0.19.0
        config.url = requestConfig.url;
        config.params = requestConfig.queryParams;
        config.data = requestConfig.data;
        assign(config, requestConfig.options);
        const copyFn = requestConfig.copyFn;

        const axiosResponse = this.axios.request(config);
        return axiosResponse.then(axiosResponse => {
            if (copyFn && axiosResponse.data) {
                (axiosResponse as any).originalData = axiosResponse.data;
                axiosResponse.data = copyFn(axiosResponse.data);
            }
            return axiosResponse;
        });
    }
}

export class AxiosRestApplicationClient extends RestApplicationClient<Axios.AxiosRequestConfig> {

    constructor(baseURL: string, axiosInstance: Axios.AxiosInstance = axios.create()) {
        axiosInstance.defaults.baseURL = baseURL;
        super(new AxiosHttpClient(axiosInstance));
    }
}
