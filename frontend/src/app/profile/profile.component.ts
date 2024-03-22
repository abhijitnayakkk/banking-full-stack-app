import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../toast/toast.component';
import { ModalComponent } from '../modal/modal.component';
import { CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Account } from '../model/account';
import { AccountService, BASE_URL } from '../services/account.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, HeaderComponent, SidebarComponent, ToastComponent, ModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  math = Math;
  base_url = BASE_URL;
  accountService = inject(AccountService);
  modalVisible = false;
  toastHeading = ""; toastDescription = ""; toastVisible = false;
  account!: Account;  file!: File;

  ngOnInit(): void {
    this.accountService.getCurrentAccount().subscribe({
      next: res => {
        this.account = res;
      },
      error: err => {
        console.log(err);

        const error = err.error;
        this.generateToast(error['title'], error['detail'])
      }
    })
  }

  alternativeImage(img: HTMLImageElement) {
    img.src = "../../assets/images.png";
  }

  onImageSubmit(form: HTMLFormElement) {
    this.accountService.uploadImage(this.file).subscribe({
      next: res => {
        this.account = res;
        this.generateToast("Success", "Profile updated")
      },
      error: err => {
        console.log(err);

        const error = err.error;
        this.generateToast(error['title'], error['detail'])
      },
      complete: () => {
        form.reset();
        this.modalVisible = false;``
      }
    }

    )
  }

  onUpdate() {
    this.accountService.updateAccount(this.account).subscribe({
      next: res => {
        this.account = res;
        this.generateToast("Success", "Account updated")
      },
      error: err => {
        console.log(err);

        const error = err.error;
        this.generateToast(error['title'], error['detail'])
      }
    })
  }

  onUpload(event: any) {
    this.file = event.target.files.item(0);
  }

  generateToast(heading: string, description: string) {
    this.toastHeading = heading;
    this.toastDescription = description;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 5000);

  }
}