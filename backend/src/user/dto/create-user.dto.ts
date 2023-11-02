import {
    IsString,
    IsNotEmpty,
    Matches,
    MaxLength,
    MinLength,
    IsEmail,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(200)
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(200)
    email: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'The password must be at least 8 characters.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message:
            'The password must contain at least one uppercase letter, one lowercase letter, one number and one special character.',
    })
    password: string;
}
