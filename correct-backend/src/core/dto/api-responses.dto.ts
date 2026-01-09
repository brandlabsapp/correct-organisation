import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ example: 'Bad Request' })
    error: string;

    @ApiProperty({ example: 'Invalid input data' })
    message: string;

    @ApiProperty({ example: '2024-01-09T10:14:28.000Z' })
    timestamp: string;

    @ApiProperty({ example: '/api/v1/resource' })
    path: string;
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
    @ApiProperty({ example: 'Validation error: phone must be a string' })
    message: string;
}
