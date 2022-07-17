import { ApiProperty } from '@nestjs/swagger';

/**
 * The entity for exception
 */
export class ErrorBody {
  @ApiProperty({
    description: 'The http status code'
  })
  status!: number;

  @ApiProperty({
    description: 'The current timestamp'
  })
  timestamp!: string;

  @ApiProperty({
    description: 'the url path'
  })
  path!: string;

  @ApiProperty({
    description: 'The http method e.g GET, POST, PUT etc'
  })
  method!: string;

  @ApiProperty({
    description: 'A description of the error message'
  })
  message!: string;

  @ApiProperty({
    description: 'The optional error code',
    required: false,
  })
  code?: string;
}
