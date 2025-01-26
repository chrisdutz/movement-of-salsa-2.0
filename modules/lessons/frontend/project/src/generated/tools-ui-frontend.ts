/* tslint:disable */
/* eslint-disable */

export interface HttpClient<O> {

    request<R>(requestConfig: { method: string; url: string; queryParams?: any; data?: any; copyFn?: (data: R) => R; options?: O; }): RestResponse<R>;
}

export class RestApplicationClient<O> {

    constructor(protected httpClient: HttpClient<O>) {
    }

    /**
     * HTTP POST /api/couples
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseCoupleController.save
     */
    save$POST$api_couples(arg0: CourseCoupleDto, options?: O): RestResponse<CourseCoupleDto> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/couples`, data: arg0, options: options });
    }

    /**
     * HTTP GET /api/couples/possible-guest-gents/{course-id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseCoupleController.findPossibleGuestGents
     */
    findPossibleGuestGents(courseId: number, options?: O): RestResponse<UserDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/couples/possible-guest-gents/${courseId}`, options: options });
    }

    /**
     * HTTP GET /api/couples/possible-guest-ladies/{course-id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseCoupleController.findPossibleGuestLadies
     */
    findPossibleGuestLadies(courseId: number, options?: O): RestResponse<UserDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/couples/possible-guest-ladies/${courseId}`, options: options });
    }

    /**
     * HTTP GET /api/couples/unpaired-gents/{course-id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseCoupleController.findUnpairedGents
     */
    findUnpairedGents(courseId: number, options?: O): RestResponse<UserDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/couples/unpaired-gents/${courseId}`, options: options });
    }

    /**
     * HTTP GET /api/couples/unpaired-ladies/{course-id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseCoupleController.findUnpairedLadies
     */
    findUnpairedLadies(courseId: number, options?: O): RestResponse<UserDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/couples/unpaired-ladies/${courseId}`, options: options });
    }

    /**
     * HTTP DELETE /api/couples/{couple-id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseCoupleController.deleteById
     */
    deleteById$DELETE$api_couples_coupleId(coupleId: number, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/couples/${coupleId}`, options: options });
    }

    /**
     * HTTP GET /api/couples/{course-id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseCoupleController.findCouplesForCourse
     */
    findCouplesForCourse(courseId: number, options?: O): RestResponse<CourseCoupleDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/couples/${courseId}`, options: options });
    }

    /**
     * HTTP GET /api/course-types
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseTypeController.findAll
     */
    findAll$GET$api_coursetypes(options?: O): RestResponse<CourseType[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/course-types`, options: options });
    }

    /**
     * HTTP POST /api/course-types
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseTypeController.save
     */
    save$POST$api_coursetypes(arg0: CourseType, options?: O): RestResponse<CourseType> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/course-types`, data: arg0, options: options });
    }

    /**
     * HTTP GET /api/course-types/not-hidden
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseTypeController.findAllNotHidden
     */
    findAllNotHidden(options?: O): RestResponse<CourseType[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/course-types/not-hidden`, options: options });
    }

    /**
     * HTTP DELETE /api/course-types/{id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseTypeController.deleteById
     */
    deleteById$DELETE$api_coursetypes_id(id: number, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/course-types/${id}`, options: options });
    }

    /**
     * HTTP GET /api/course-types/{id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseTypeController.findById
     */
    findById$GET$api_coursetypes_id(id: number, options?: O): RestResponse<CourseType> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/course-types/${id}`, options: options });
    }

    /**
     * HTTP GET /api/courses
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseController.findAll
     */
    findAll$GET$api_courses(options?: O): RestResponse<CourseDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/courses`, options: options });
    }

    /**
     * HTTP POST /api/courses
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseController.save
     */
    save$POST$api_courses(arg0: CourseDto, options?: O): RestResponse<CourseDto> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/courses`, data: arg0, options: options });
    }

    /**
     * HTTP GET /api/courses/up-and-running
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseController.findUpAndRunningCourses
     */
    findUpAndRunningCourses(options?: O): RestResponse<CourseDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/courses/up-and-running`, options: options });
    }

    /**
     * HTTP GET /api/courses/{courseTypeId}/rates
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseController.findCourseTypeRates
     */
    findCourseTypeRates(courseTypeId: number, options?: O): RestResponse<CourseTypeRate[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/courses/${courseTypeId}/rates`, options: options });
    }

    /**
     * HTTP DELETE /api/courses/{id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseController.deleteById
     */
    deleteById$DELETE$api_courses_id(id: number, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/courses/${id}`, options: options });
    }

    /**
     * HTTP GET /api/courses/{id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseController.findById
     */
    findById$GET$api_courses_id(id: number, options?: O): RestResponse<CourseDto> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/courses/${id}`, options: options });
    }

    /**
     * HTTP POST /api/registrations
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseRegistrationController.save
     */
    save$POST$api_registrations(arg0: CourseRegistrationDto, options?: O): RestResponse<CourseRegistrationDto> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/registrations`, data: arg0, options: options });
    }

    /**
     * HTTP GET /api/registrations/partners/{user-id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseRegistrationController.findFindPartnersForUser
     */
    findFindPartnersForUser(userId: number, options?: O): RestResponse<UserDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/registrations/partners/${userId}`, options: options });
    }

    /**
     * HTTP GET /api/registrations/registrars
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseRegistrationController.findUsers
     */
    findUsers(options?: O): RestResponse<UserDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/registrations/registrars`, options: options });
    }

    /**
     * HTTP GET /api/registrations/{course-id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseRegistrationController.findRegistrationsForCourse
     */
    findRegistrationsForCourse(courseId: number, options?: O): RestResponse<CourseRegistrationDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/registrations/${courseId}`, options: options });
    }

    /**
     * HTTP DELETE /api/registrations/{id}
     * Java method: com.toddysoft.ui.modules.lessons.controller.CourseRegistrationController.deleteById
     */
    deleteById$DELETE$api_registrations_id(id: number, options?: O): RestResponse<void> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/registrations/${id}`, options: options });
    }
}

export interface CourseCoupleDto {
    confirmed: boolean;
    courseId: number;
    gent: UserDto;
    gentPaying: boolean;
    id: number;
    lady: UserDto;
    ladyPaying: boolean;
    remarks: string;
}

export interface CourseDto {
    closed: boolean;
    courseTypeCode: string;
    courseTypeId: number;
    id: number;
    lessons: Lesson[];
}

export interface CourseRegistrationDto {
    courseId: number;
    courseRegistrationType: CourseRegistrationType;
    courseStartDate: Date;
    courseTypeCode: string;
    discount: number;
    discountRemarks: string;
    id: number;
    partner?: UserDto;
    price: number;
    rateName: string;
    registrar: UserDto;
    remarks: string;
}

export interface CourseType {
    code: string;
    description: string;
    hidden: boolean;
    id: number;
    image: Image;
    listOrder: number;
    rates: CourseTypeRate[];
    title: string;
}

export interface CourseTypeRate {
    coupleRate: boolean;
    id: number;
    listOrder: number;
    price: number;
    title: string;
}

export interface Image {
    height: number;
    imageData: string;
    width: number;
}

export interface Lesson {
    endTime: Date;
    id: number;
    location: string;
    locationLat: number;
    locationLon: number;
    startTime: Date;
}

export interface UserDto {
    id: number;
    name: string;
    sex: Sex;
    size: number;
}

export type CourseRegistrationType = "SINGLE" | "COUPLE";

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


// Added by 'GenericInterfaceWorkaroundExtension' extension

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
