import { Contains, IsInt, Length, Max, Min } from 'class-validator';
export class CreateCoffeeDto {
  @Length(1, 10, {
    message(validationArguments) {
      console.log(validationArguments);
      // {
      //   targetName: 'CreateCoffeeDto',
      //   property: 'title',
      //   object: CreateCoffeeDto {
      //     title: '11111111111111111',
      //     text: 'hellooo\n',
      //     rating: 10
      //   },
      //   value: '11111111111111111',
      //   constraints: [ 1, 10 ]
      // }
      return 'title长度在1-10之间';
    },
  })
  title: string;

  @Contains('hello')
  text: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;
}
