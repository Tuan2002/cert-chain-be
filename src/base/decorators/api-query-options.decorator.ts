import { Filter, QueryOptionsDto } from '@base/dtos/query-options.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional, ApiQuery, PickType } from '@nestjs/swagger';

export class QueryOptionsSwagger extends PickType(QueryOptionsDto, [
  'page',
  'limit',
  'search',
]) {
  @ApiPropertyOptional({
    type: 'object',
    properties: {},
    example: {
      sort: { field: 'desc' },
      filters: {
        field: { eq: 'abc' },
      },
    },
  })
  additionalQuery: Partial<{
    sort: Record<string, 'desc' | 'asc'>;
    filters: Record<string, Filter>;
  }>;
}

export function ApiQueryOptions() {
  return applyDecorators(ApiQuery({ type: QueryOptionsSwagger }));
}
