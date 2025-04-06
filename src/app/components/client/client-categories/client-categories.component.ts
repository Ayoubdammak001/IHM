import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-categories.component.html',
  styleUrls: ['./client-categories.component.scss'],
})
export class ClientCategoriesComponent {
  categories = [
    {
      slug: 'plumbing',
      title: 'Plomberie & Dépannage',
      description: 'Installation & réparation de sanitaires, éviers, robinets et canalisations',
      image: '/assets/images/category/plumbing.jpg',
      emoji: '🔧',
    },
    {
      slug: 'electrical-repair',
      title: 'Réparation électrique',
      description: 'Installation & Maintenance Électrique pour un fonctionnement sûr et efficace de vos équipements.',
      image: '/assets/images/category/electrical-repair.jpg',
      emoji: '💡',
    },
    {
      slug: 'nettoyage',
      title: 'Nettoyage à domicile',
      description: 'Services de ménage, repassage et entretien régulier pour un intérieur toujours impeccable.',
      image: 'assets/images/nettoyage1.jpeg',
      emoji: '🧹',
    },
    {
      slug: 'jardinage',
      title: 'Jardinage & Extérieur',
      description: 'Entretien de jardin, tonte de pelouse, taille de haies',
      image: 'assets/images/jardinage1.jpeg',
      emoji: '🌿',
    },
  ];
}