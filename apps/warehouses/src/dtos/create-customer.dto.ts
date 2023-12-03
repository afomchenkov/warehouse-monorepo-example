import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

@InputType()
export class CreateCustomerDto {
  @Field({ nullable: false })
  @IsNotEmpty({ message: 'username is missing' })
  @IsString()
  @Length(3, 51, { message: 'username length is invalid' })
  username: string;

  @Field()
  @IsNotEmpty({ message: 'firstName is missing' })
  @IsString()
  @Length(2, 70, { message: 'firstName length is invalid' })
  firstName: string;

  @Field()
  @IsNotEmpty({ message: 'lastName is missing' })
  @IsString()
  @Length(2, 70, { message: 'lastName length is invalid' })
  lastName: string;

  @Field()
  @IsNotEmpty({ message: 'email is missing' })
  @IsEmail()
  email: string;
}
