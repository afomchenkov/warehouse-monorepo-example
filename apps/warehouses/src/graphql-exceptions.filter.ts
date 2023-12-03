import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

@Catch(HttpException)
export class GraphqlExceptionsFilter implements GqlExceptionFilter {
  private readonly logger = new Logger('DataGraphqlExceptionsFilterService');

  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const status = exception.getStatus();

    this.logger.error({
      statusCode: status,
      message: exception.message,
      info: gqlHost.getInfo(),
    });

    return exception;
  }
}
