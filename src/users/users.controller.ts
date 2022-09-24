import { Body, Controller, Post, Get, Injectable, Param, Query, Delete, Patch, NotFoundException, UseInterceptors, ClassSerializerInterceptor, Session } from '@nestjs/common';
// import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateuserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Injectable()
@Controller('auth')
// @Serialize(UserDto) //custom interceptor
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Post("signup")
  async signup(@Body() body: CreateuserDto, @Session() session: any){
    const user = await this.authService.signup(body.email, body.password)
    session.UserId = user.id
    return user
  }

  @Post("signin")
  async signin(@Body() body: CreateuserDto, @Session() session: any){
    const user  = await this.authService.signin(body.email, body.password)
    session.UserId = user.id
    return user
  }

  @Get("/whoami")
  whoAmI(@Session() session: any){
    return this.usersService.findOne(session.userId)
  }

  @Post("/signout")
  signout(@Session() session: any){
    session.userId = null
  }

  // @UseInterceptors(ClassSerializerInterceptor) // nest recom.
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get(":id")
  async findUser(@Param("id") id: string){4
    console.log("Handlre is runnning");
    const user = await this.usersService.findOne(parseInt(id))
    if(!user)
      throw new NotFoundException("User not found")

    return user
  }

  @Get()
  findAllUsers(@Query("email") email: string){
    return this.usersService.find(email)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateUserDto){
    return this.usersService.update(parseInt(id), body)
  }

  @Delete(":id")
  delete(@Param("id") id: string){
    return this.usersService.remove(parseInt(id))
  }
}