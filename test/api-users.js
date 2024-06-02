import supertest from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

const request = supertest('https://gorest.co.in/public-api/');

const token = process.env.TOKEN;

describe('Users', () => {

    let idUser;

    describe('POST /public-api/users', () =>{
        it('Create a new user with valid data - Positive', () => {
            const data = {
                name: 'aca caca',
                email: `aca${Math.round(Math.random() * 999)}@mail.co`,
                gender: 'female',
                status: 'active'
            };
    
            return request.post(`users`)
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .then((res) => {
                    console.log(res.body);
                    expect(res.body.code).to.be.eq(201);
                    expect(res.body.data).to.deep.include(data);
                    idUser = res.body.data.id;
            });
        });

        it('Fail to create a new user with empty fields - Negative', () => {
            const data = {
                name: '',
                email: '',
                gender: 'female',
                status: 'active'
            };
    
            return request.post(`users`)
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .then((res) => {
                    console.log(res.body);
                    expect(res.body.code).to.be.eq(422);
                    expect(res.body.data).to.not.be.empty;
                    expect(res.body.data[0].message).to.be.eq("can't be blank")
                    expect(res.body.data[1].message).to.be.eq("can't be blank");
            });
        });
    });

    describe('GET /public-api/users/xxx', () => {    
        it('Get user details with valid ID - Positive', () => {
            return request.get(`users/${idUser}?access-token=${token}`)
                .then((res) => {
                    console.log(res.body)
                    expect(res.body.code).to.be.eq(200);
                    expect(res.body.data.id).to.be.eq(idUser);
            });
        });

        it('Fail to get user details with invalid id - Negative', () => {
            const invalidId = idUser * 5;
            return request.get(`users/${invalidId}?access-token=${token}`)
                .then((res) => {
                    console.log(res.body)
                    expect(res.body.code).to.be.eq(404);
                    expect(res.body.data.message).to.be.eq('Resource not found');
            });
        });
    });
    
    describe('PUT /public-api/users/xxx', () => {
        it('Update user details with valid data - Positive', () => {
            const data = {
                name: 'jojo',
                status: 'inactive'
            };
    
            return request.put(`users/${idUser}`)
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .then((res) => {
                    console.log(res.body);
                    expect(res.body.code).to.be.eq(200);
                    expect(res.body.data).to.deep.include(data);
            });
        });

        it('Fail to update user details with invalid token - Negative', () => {
            const data = {
                name: 'eka',
                gender: 'male'
            };
    
            return request.put(`users/${idUser}`)
                .set('Authorization', `Bearer ${token}+56`)
                .send(data)
                .then((res) => {
                    console.log(res.body);
                    expect(res.body.code).to.be.eq(401);
                    expect(res.body.data.message).to.be.eq("Invalid token");
            });
        });

        it('Fail to update user details with invalid data - Negative', () => {
            const data = {
                name: '',
                status: 'inactive'
            };
    
            return request.put(`users/${idUser}`)
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .then((res) => {
                    console.log(res.body);
                    expect(res.body.code).to.be.eq(422);
                    expect(res.body.data[0].message).to.be.eq("can't be blank");
            });
        });
    });
    
    describe('DELETE /public-api/users/xxx', () => {
        it('Delete user with valid ID - Positive', () => {
            return request.delete(`users/${idUser}`)
                .set('Authorization', `Bearer ${token}`)
                .then((res) => {
                    console.log(res.body);
                    expect(res.body.code).to.be.eq(204);
                    expect(res.body.data).to.be.eq(null);
            });
        });

        it('Fail to delete user with invalid ID - Negative', () => {
            return request.delete(`users/${idUser}`)
                .set('Authorization', `Bearer ${token}`)
                .then((res) => {
                    console.log(res.body);
                    expect(res.body.code).to.be.eq(404);
                    expect(res.body.data.message).to.be.eq('Resource not found');
            });
        });
    });
})