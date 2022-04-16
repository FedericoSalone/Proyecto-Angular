import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog'
import { inject } from '@angular/core/testing';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {


  freshnessList = ["Nuevo", "Usado", "Fresco" ,"Envasado"];
  productForm !: FormGroup;
  actionBtn : string = 'Guardar';
  constructor(private formBuilder : FormBuilder, 
    private api : ApiService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      nombre : ['',Validators.required],
      categoria : ['',Validators.required],
      freshness : ['',Validators.required],
      precio : ['',Validators.required],
      comentario : ['',Validators.required],
      date : ['',Validators.required],
    })
    if(this.editData){
      this.actionBtn = 'Actualizar';
      this.productForm.controls['nombre'] .setValue(this.editData.nombre);
      this.productForm.controls['categoria'] .setValue(this.editData.categoria);
      this.productForm.controls['freshness'] .setValue(this.editData.freshness);
      this.productForm.controls['precio'] .setValue(this.editData.precio);
      this.productForm.controls['comentario'] .setValue(this.editData.comentario);
      this.productForm.controls['date'] .setValue(this.editData.date);
    }
  }
  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next: (res)=>{
            alert("Producto Agregado con Exito");
            this.productForm.reset();
            this.dialogRef.close('guardar');
          },
          error: ()=>{
            alert("Error al agregar el producto");
          }
        })
      }
    }else{
      this.updateProduct()
    }
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Producto actualizado con exito");
        this.productForm.reset();
        this.dialogRef.close('actualizado');
      },
      error:()=>{
        alert("Error al actualizar el producto");
      }
    })
  }
}
