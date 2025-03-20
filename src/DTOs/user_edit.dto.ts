import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class UserEditDTO {

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastname?: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @IsEmail({}, { message: 'Email is invalid' })
    email?: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MinLength(8, { message: "Password must have at least 8 characters" })
    @Matches(/[A-Z]/, { message: 'The password must contain at least one uppercase letter' })
    @Matches(/[a-z]/, { message: 'The password must contain at least one lowercase letter' })
    @Matches(/\d/, { message: 'The password must contain at least one number' })
    @Matches(/[@$!%*?&.]/, { message: 'The password must contain at least one special character (@, $, !, %, *, ?, &, .)' })
    password?: string;
}
