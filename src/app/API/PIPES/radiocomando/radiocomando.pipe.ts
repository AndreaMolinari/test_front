import { Pipe, PipeTransform } from '@angular/core';
import { Radiocomando, RadiocomandoAPI } from '../../radiocomando/radiocomando';

@Pipe({
  name: 'radiocomando'
})
export class RadiocomandoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

  tranformGETall(input: RadiocomandoAPI[]): Radiocomando[] {
    const newList: Radiocomando[] = [];

    input.forEach(component => {
      const newComponent: Radiocomando = {
        id: component.id,
        unitcode: component.unitcode,
        brand: component.modello.brand.marca,
        modello: component.modello.modello
      };

      newList.push(newComponent);
    });

    return newList;
  }

}
