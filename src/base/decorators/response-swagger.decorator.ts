import { ResponseApp } from '@base/types';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface ApiResponseTypeOptions {
  isArray?: boolean;
}

export const ApiResponseType = <TModel extends Type<any>>(
  model: TModel,
  options: ApiResponseTypeOptions = { isArray: false },
) => {
  const properties = options.isArray
    ? {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(model) },
        },
      }
    : {
        data: {
          type: 'object',
          $ref: getSchemaPath(model),
        },
      };
  return applyDecorators(
    ApiExtraModels(ResponseApp, model),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseApp) },
          {
            properties,
          },
        ],
      },
    }),
  );
};
