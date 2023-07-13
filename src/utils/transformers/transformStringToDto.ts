import { FileBillDto } from '../../presentation/dtos/files/file-bill.dto';

export const transformStringToDto = {
  toFileDto(stringToTransform: string): FileBillDto {
    const separedString = stringToTransform.split(';');
    return new FileBillDto(
      separedString[0],
      separedString[1],
      Number(separedString[2]),
      separedString[3],
    );
  },
};
